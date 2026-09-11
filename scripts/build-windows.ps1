# Build static site on Windows for Nginx / static hosting.
# Uses a temp build directory when .output is locked by preview/dev processes.

$ErrorActionPreference = 'Stop'

$ProjectRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$SiteUrl = if ($env:NUXT_PUBLIC_SITE_URL) { $env:NUXT_PUBLIC_SITE_URL } else { 'https://yelinktrans.com' }
$OutputPublic = Join-Path $ProjectRoot '.output\public'
$DistDir = Join-Path $ProjectRoot 'dist'
$UseTempBuild = $false
$TempBuildRoot = Join-Path $env:TEMP "yelinktrans-nginx-build"

Set-Location $ProjectRoot

Write-Host "==> Installing dependencies"
corepack enable | Out-Null
pnpm install --frozen-lockfile

Write-Host "==> Type checking"
$env:NUXT_PUBLIC_SITE_URL = $SiteUrl
pnpm typecheck

function Clear-OutputDirectory {
  if (-not (Test-Path (Join-Path $ProjectRoot '.output'))) {
    return
  }

  try {
    Remove-Item -LiteralPath (Join-Path $ProjectRoot '.output') -Recurse -Force -ErrorAction Stop
  } catch {
    Write-Warning ".output is locked. Building in temp directory instead."
    $script:UseTempBuild = $true
  }
}

Clear-OutputDirectory

if ($UseTempBuild) {
  if (Test-Path $TempBuildRoot) {
    Remove-Item -LiteralPath $TempBuildRoot -Recurse -Force
  }

  New-Item -ItemType Directory -Path $TempBuildRoot | Out-Null
  robocopy $ProjectRoot $TempBuildRoot /E /XD node_modules .output .nuxt dist .git .data /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null

  Push-Location $TempBuildRoot
  try {
    Write-Host "==> Installing dependencies (temp build)"
    corepack enable | Out-Null
    pnpm install --frozen-lockfile

    Write-Host "==> Generating static site (temp build)"
    $env:NUXT_PUBLIC_SITE_URL = $SiteUrl
    pnpm generate
  } finally {
    Pop-Location
  }

  $GeneratedPublic = Join-Path $TempBuildRoot '.output\public'
} else {
  Write-Host "==> Generating static site"
  $env:NUXT_PUBLIC_SITE_URL = $SiteUrl
  pnpm generate
  $GeneratedPublic = $OutputPublic
}

if (-not (Test-Path (Join-Path $GeneratedPublic 'index.html'))) {
  throw "Build failed: index.html was not generated."
}

Write-Host "==> Syncing build output to dist"
if (Test-Path $DistDir) {
  Remove-Item -LiteralPath $DistDir -Recurse -Force
}
robocopy $GeneratedPublic $DistDir /E /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null

if ($UseTempBuild) {
  Write-Host "==> Syncing build output to .output/public"
  try {
    New-Item -ItemType Directory -Path (Split-Path $OutputPublic) -Force | Out-Null
    if (Test-Path $OutputPublic) {
      Remove-Item -LiteralPath $OutputPublic -Recurse -Force -ErrorAction Stop
    }
    robocopy $GeneratedPublic $OutputPublic /E /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null
  } catch {
    Write-Warning "Could not update .output/public (directory may be locked). dist/ is ready for deployment."
  }
}

Write-Host "==> Running QA checks"
$env:STATIC_OUTPUT_DIR = $DistDir
pnpm qa:static
pnpm qa:english-responsive
Remove-Item Env:STATIC_OUTPUT_DIR -ErrorAction SilentlyContinue

$fileCount = (Get-ChildItem $DistDir -Recurse -File).Count
Write-Host ""
Write-Host "Build complete."
Write-Host "  Site URL : $SiteUrl"
Write-Host "  Output   : $OutputPublic"
Write-Host "  Package  : $DistDir ($fileCount files)"
Write-Host ""
Write-Host "Upload everything inside dist/ to your Nginx web root."
