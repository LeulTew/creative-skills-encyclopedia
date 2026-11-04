import argparse
import asyncio
import base64
import json
import os
from datetime import timedelta
from pathlib import Path

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client


ROOT = Path(__file__).parent
SERVER = ROOT / "blender-mcp-env" / "Scripts" / "mcp-for-blender.exe"


async def run(args):
    environment = dict(os.environ)
    environment.update({
        "DISABLE_TELEMETRY": "true",
        "BLENDER_MCP_DISABLE_TELEMETRY": "true",
        "MCP_DISABLE_TELEMETRY": "true",
        "PYTHONUTF8": "1",
        "BLENDER_HOST": "127.0.0.1",
        "BLENDER_PORT": "9876",
    })
    parameters = StdioServerParameters(command=str(SERVER), args=["--host", "127.0.0.1", "--port", "9876"], env=environment)
    with (ROOT / "blender-mcp-client.log").open("a", encoding="utf-8") as errors:
        async with stdio_client(parameters, errlog=errors) as (reader, writer):
            async with ClientSession(reader, writer, read_timeout_seconds=timedelta(seconds=args.timeout)) as session:
                initialization = await session.initialize()
                if args.tool == "list":
                    tools = await session.list_tools()
                    print(json.dumps({
                        "server": initialization.serverInfo.model_dump(),
                        "tools": [{"name": tool.name, "schema": tool.inputSchema} for tool in tools.tools],
                    }, indent=2))
                    return
                arguments = json.loads(args.arguments.read_text(encoding="utf-8")) if args.arguments else {}
                if args.script:
                    arguments = {"code": args.script.read_text(encoding="utf-8"), "user_prompt": ""}
                result = await session.call_tool(args.tool, arguments=arguments)
                execution_failed = args.tool == "execute_blender_code" and not any(
                    item.type == "text" and item.text.startswith("Code executed successfully:")
                    for item in result.content
                )
                output = []
                for index, item in enumerate(result.content):
                    if item.type == "text":
                        output.append({"type": "text", "text": item.text})
                    elif item.type == "image":
                        extension = "png" if item.mimeType == "image/png" else "jpg"
                        image = ROOT / f"blender-mcp-{args.image_label}-{index}.{extension}"
                        image.write_bytes(base64.b64decode(item.data))
                        output.append({"type": "image", "path": str(image), "mimeType": item.mimeType})
                    else:
                        output.append(item.model_dump())
                print(json.dumps({"isError": result.isError or execution_failed, "content": output}, indent=2))
                if result.isError or execution_failed:
                    raise RuntimeError("Blender MCP reported a tool error.")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("tool")
    parser.add_argument("--arguments", type=Path)
    parser.add_argument("--script", type=Path)
    parser.add_argument("--timeout", type=int, default=120)
    parser.add_argument("--image-label", default="viewport")
    args = parser.parse_args()
    if args.script and args.tool != "execute_blender_code":
        raise ValueError("--script is only supported for execute_blender_code")
    asyncio.run(run(args))


if __name__ == "__main__":
    main()
