# Gera cv/leon-nascimento-moreira.pdf a partir de cv.html com o Chrome headless.
# Uso: powershell -ExecutionPolicy Bypass -File scripts\gerar-pdf.ps1
$root = Split-Path -Parent $PSScriptRoot
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$src = Join-Path $root "cv.html"
$out = Join-Path $root "cv\leon-nascimento-moreira.pdf"
$udd = Join-Path $env:TEMP ("chrome-pdf-" + [guid]::NewGuid().ToString("N").Substring(0, 8))
# Chrome headless aborta sem HOME/user-data-dir definidos (gotcha das faturas do Linegestao)
if (-not $env:HOME) { $env:HOME = $env:USERPROFILE }
& $chrome --headless=new --disable-gpu --no-pdf-header-footer --user-data-dir="$udd" --print-to-pdf="$out" ("file:///" + $src.Replace("\", "/")) 2>$null | Out-Null
Remove-Item -Recurse -Force $udd -ErrorAction SilentlyContinue
if (Test-Path $out) { Write-Output ("ok " + $out + " " + (Get-Item $out).Length + " bytes") } else { Write-Error "PDF não foi gerado" }
