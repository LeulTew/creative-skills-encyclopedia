<#
.SYNOPSIS
    Local preview runner for the Creative Engineering & Skills Encyclopedia showcase app.
.DESCRIPTION
    Launches a lightweight local HTTP server using Bun, Python, or npx serve on an
    available port, serves the showcase-app directory, and opens the default web browser.
.PARAMETER Port
    Optional port number. If omitted or 0, dynamically detects an available port (starts at 4173).
.PARAMETER Engine
    Optional engine preference: 'auto' (default), 'bun', 'python', 'npx', or 'listener'.
.PARAMETER NoBrowser
    Do not automatically open the browser window.
.EXAMPLE
    .\preview.ps1
.EXAMPLE
    .\preview.ps1 -Port 8080 -Engine Python
.EXAMPLE
    .\preview.ps1 -NoBrowser
#>

[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [int]$Port = 0,

    [Parameter(Position = 1)]
    [ValidateSet('auto', 'bun', 'python', 'npx', 'listener')]
    [string]$Engine = 'auto',

    [switch]$NoBrowser
)

$ErrorActionPreference = 'Stop'

$ShowcaseDir = Join-Path $PSScriptRoot "showcase-app"
if (-not (Test-Path (Join-Path $ShowcaseDir "index.html"))) {
    Write-Error "Could not find showcase-app/index.html at: $ShowcaseDir"
    exit 1
}

# Function to test if a TCP port is available
function Test-PortAvailable ([int]$TestPort) {
    try {
        $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $TestPort)
        $listener.Start()
        $listener.Stop()
        return $true
    } catch {
        return $false
    }
}

# Find available port
if ($Port -le 0) {
    $candidate = 4173
    while (-not (Test-PortAvailable $candidate)) {
        $candidate++
        if ($candidate -gt 4200) {
            $candidate = 8080
            while (-not (Test-PortAvailable $candidate)) {
                $candidate++
            }
            break
        }
    }
    $Port = $candidate
} elseif (-not (Test-PortAvailable $Port)) {
    Write-Warning "Port $Port is currently in use. Searching for next available port..."
    while (-not (Test-PortAvailable $Port)) {
        $Port++
    }
}

# Resolve execution engine
$ResolvedEngine = $Engine
if ($ResolvedEngine -eq 'auto') {
    if (Get-Command "bun" -ErrorAction SilentlyContinue) {
        $ResolvedEngine = 'bun'
    } elseif (Get-Command "python" -ErrorAction SilentlyContinue) {
        $ResolvedEngine = 'python'
    } elseif (Get-Command "python3" -ErrorAction SilentlyContinue) {
        $ResolvedEngine = 'python'
    } elseif (Get-Command "npx" -ErrorAction SilentlyContinue) {
        $ResolvedEngine = 'npx'
    } else {
        $ResolvedEngine = 'listener'
    }
}

$LocalUrl = "http://localhost:$Port"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  CREATIVE ENGINEERING & SKILLS ENCYCLOPEDIA (2026 EDITION)" -ForegroundColor DarkCyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Root Directory : $ShowcaseDir"
Write-Host "  Serving Engine : $ResolvedEngine"
Write-Host "  Local URL      : $LocalUrl" -ForegroundColor Green
Write-Host "  Status         : Ready for testing & review"
Write-Host "------------------------------------------------------------"
Write-Host "  Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

if (-not $NoBrowser) {
    Start-Process $LocalUrl
}

switch ($ResolvedEngine) {
    'bun' {
        $normalizedDir = ($ShowcaseDir -replace '\\', '/') + '/'
        $bunScript = @"
const dir = "$normalizedDir";
const port = $Port;
Bun.serve({
  port,
  fetch(req) {
    const url = new URL(req.url);
    const rel = url.pathname === '/' ? 'index.html' : url.pathname.replace(/^\/+/, '');
    const file = Bun.file(dir + rel);
    return file.exists().then(exists => {
      if (exists) return new Response(file);
      return new Response('404 Not Found', { status: 404 });
    });
  }
});
"@
        & bun -e $bunScript
    }

    'python' {
        $pyCmd = if (Get-Command "python" -ErrorAction SilentlyContinue) { "python" } else { "python3" }
        & $pyCmd -m http.server $Port --directory $ShowcaseDir
    }

    'npx' {
        & npx --yes serve $ShowcaseDir -l $Port --no-clipboard
    }

    'listener' {
        $listener = [System.Net.HttpListener]::new()
        $prefix = "http://localhost:$Port/"
        $listener.Prefixes.Add($prefix)
        $listener.Start()

        $mimeTypes = @{
            '.html' = 'text/html; charset=utf-8'
            '.css'  = 'text/css; charset=utf-8'
            '.js'   = 'application/javascript; charset=utf-8'
            '.json' = 'application/json; charset=utf-8'
            '.svg'  = 'image/svg+xml'
            '.png'  = 'image/png'
            '.jpg'  = 'image/jpeg'
            '.webp' = 'image/webp'
            '.ico'  = 'image/x-icon'
        }

        try {
            while ($listener.IsListening) {
                $context = $listener.GetContext()
                $request = $context.Request
                $response = $context.Response

                $rawPath = $request.Url.LocalPath.TrimStart('/')
                if ([string]::IsNullOrWhiteSpace($rawPath)) { $rawPath = "index.html" }
                $filePath = Join-Path $ShowcaseDir $rawPath

                if (Test-Path $filePath -PathType Leaf) {
                    $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                    $response.ContentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { 'application/octet-stream' }
                    $bytes = [System.IO.File]::ReadAllBytes($filePath)
                    $response.ContentLength64 = $bytes.Length
                    $response.StatusCode = 200
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                } else {
                    $response.StatusCode = 404
                    $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $rawPath")
                    $response.ContentLength64 = $msg.Length
                    $response.OutputStream.Write($msg, 0, $msg.Length)
                }
                $response.OutputStream.Close()
            }
        } finally {
            $listener.Stop()
            $listener.Close()
        }
    }
}
