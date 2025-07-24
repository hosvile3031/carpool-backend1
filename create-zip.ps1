# PowerShell script to create a ZIP file for GitHub upload
Write-Host "🚀 Creating ZIP file for GitHub upload..." -ForegroundColor Green

# Create a temporary directory for clean files
$tempDir = "carpool-backend-upload"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir

# Copy all necessary files (excluding node_modules and .git)
$filesToCopy = @(
    "frontend",
    "middleware", 
    "models",
    "routes",
    "services",
    "setup-guides",
    "tests",
    "uploads",
    "*.js",
    "*.json",
    "*.md",
    "*.yaml",
    ".env.example",
    ".gitignore",
    "Procfile"
)

foreach ($item in $filesToCopy) {
    if ($item -like "*.*") {
        # Copy individual files
        Get-ChildItem -Path $item -ErrorAction SilentlyContinue | Copy-Item -Destination $tempDir -Force
    } else {
        # Copy directories
        if (Test-Path $item) {
            Copy-Item -Path $item -Destination $tempDir -Recurse -Force
        }
    }
}

# Remove node_modules from frontend copy to reduce size
$frontendNodeModules = Join-Path $tempDir "frontend/node_modules"
if (Test-Path $frontendNodeModules) {
    Remove-Item $frontendNodeModules -Recurse -Force
    Write-Host "✅ Removed frontend/node_modules to reduce size" -ForegroundColor Yellow
}

# Create ZIP file
$zipPath = "carpool-backend-deployment.zip"
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

# Use PowerShell 5.0+ Compress-Archive
Compress-Archive -Path "$tempDir\*" -DestinationPath $zipPath -Force

# Clean up temporary directory
Remove-Item $tempDir -Recurse -Force

Write-Host "✅ ZIP file created: $zipPath" -ForegroundColor Green
Write-Host "📁 File size: $((Get-Item $zipPath).Length / 1MB) MB" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to GitHub.com and create a new repository called 'carpool-backend'"
Write-Host "2. Upload the ZIP file contents to your repository"
Write-Host "3. Go to Render.com and deploy from your GitHub repository"
Write-Host ""
Write-Host "🚀 Your carpool backend is ready for deployment!" -ForegroundColor Green
