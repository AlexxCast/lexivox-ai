# Robust, lightweight local web server for LexiVox AI using PowerShell HttpListener
param (
    [int]$Port = 8085
)

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "   🚀 LexiVox AI Server is active on $prefix" -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Cyan
} catch {
    Write-Host "Errore avvio server: $_" -ForegroundColor Red
    exit 1
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
}

$baseDir = $PSScriptRoot

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $relPath = $request.Url.LocalPath
        if ($relPath.StartsWith("/")) {
            $relPath = $relPath.Substring(1)
        }
        if ($relPath.Length -eq 0) {
            $relPath = "index.html"
        }

        # Resolve path safely
        $safePath = [System.IO.Path]::GetFullPath((Join-Path $baseDir $relPath))
        if (-not $safePath.StartsWith($baseDir, [System.StringComparison]::OrdinalIgnoreCase)) {
            $response.StatusCode = 403
            $response.Close()
            continue
        }

        $response.KeepAlive = $false
        $response.AddHeader("Access-Control-Allow-Origin", "*")
        $response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate")

        if (Test-Path $safePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($safePath).ToLower()
            $contentType = "application/octet-stream"
            if ($mimeTypes.ContainsKey($ext)) {
                $contentType = $mimeTypes[$ext]
            }
            $response.ContentType = $contentType

            $bytes = [System.IO.File]::ReadAllBytes($safePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.OutputStream.Flush()
            $response.StatusCode = 200
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)
            $response.OutputStream.Flush()
        }
        $response.Close()
    } catch {
        # ignore client disconnects
    }
}
