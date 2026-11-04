import json
import os
import sys
from pathlib import Path

import bpy


ROOT = Path(r"C:\Users\USER-PC\.copilot\session-state\eafeecd4-6448-41a8-93bc-7d8a4d4eca17\files")
BACKUP = ROOT / "blender-original-recovery.blend"
REPORT = ROOT / "blender-connection.json"

for name in ("DISABLE_TELEMETRY", "BLENDER_MCP_DISABLE_TELEMETRY", "MCP_DISABLE_TELEMETRY"):
    os.environ[name] = "true"

original = {
    "filepath": bpy.data.filepath,
    "dirty": bpy.data.is_dirty,
    "scene": bpy.context.scene.name,
    "objects": [{"name": obj.name, "type": obj.type} for obj in bpy.context.scene.objects],
}
if not BACKUP.exists():
    bpy.ops.wm.save_as_mainfile(filepath=str(BACKUP), copy=True)

addons = Path(bpy.utils.user_resource("SCRIPTS")) / "addons"
if str(addons) not in sys.path:
    sys.path.insert(0, str(addons))
bpy.context.scene["blendermcp_auto_start_server"] = False
bpy.ops.preferences.addon_enable(module="blender_mcp")
addon = sys.modules["blender_mcp"]
scene = bpy.context.scene
scene.blendermcp_auto_start_server = False
for setting in ("blendermcp_use_polyhaven", "blendermcp_use_hyper3d", "blendermcp_use_hunyuan3d", "blendermcp_use_sketchfab", "blendermcp_use_polypizza"):
    if hasattr(scene, setting):
        setattr(scene, setting, False)
preferences = bpy.context.preferences.addons.get("blender_mcp")
if preferences and hasattr(preferences.preferences, "telemetry_consent"):
    preferences.preferences.telemetry_consent = False
existing = getattr(bpy.types, "blendermcp_server", None)
if existing and existing.running:
    if existing.host not in ("127.0.0.1", "localhost") or existing.port != 9876:
        raise RuntimeError("An unexpected Blender bridge is already running; left untouched.")
else:
    server = addon.BlenderMCPServer(host="127.0.0.1", port=9876)
    bpy.types.blendermcp_server = server
    server.start()
    scene.blendermcp_server_running = server.running
    if not server.running:
        raise RuntimeError("The localhost Blender bridge did not start.")
report = {
    "blender_version": bpy.app.version_string,
    "pid": os.getpid(),
    "host": "127.0.0.1",
    "port": 9876,
    "telemetry_disabled": True,
    "external_integrations_enabled": False,
    "recovery_copy": str(BACKUP),
    "original": original,
    "addon_protocol": getattr(addon, "ADDON_PROTOCOL_VERSION", None),
}
REPORT.write_text(json.dumps(report, indent=2), encoding="utf-8")
print("KEEPSAKE_MCP_CONNECTED", json.dumps(report))
