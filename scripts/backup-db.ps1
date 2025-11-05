# Database Backup Script (PowerShell)
# Creates a timestamped backup of the SQLite database

param(
    [string]$DbPath = "prisma/dev.db",
    [string]$BackupDir = "backups"
)

# Create backup directory if it doesn't exist
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

# Check if database exists
if (-not (Test-Path $DbPath)) {
    Write-Host "Error: Database file not found at $DbPath" -ForegroundColor Red
    exit 1
}

# Generate timestamp
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupFile = Join-Path $BackupDir "db_backup_$Timestamp.db"

# Create backup
Write-Host "Creating database backup..." -ForegroundColor Cyan
Copy-Item $DbPath $BackupFile

# Compress backup
Write-Host "Compressing backup..." -ForegroundColor Cyan
$CompressedFile = "$BackupFile.gz"
# Note: PowerShell doesn't have built-in gzip, so we'll use .zip instead
$ZipFile = "$BackupFile.zip"
Compress-Archive -Path $BackupFile -DestinationPath $ZipFile -Force
Remove-Item $BackupFile

# Get file size
$FileSize = (Get-Item $ZipFile).Length / 1MB
$FileSizeFormatted = "{0:N2} MB" -f $FileSize

Write-Host ""
Write-Host "✓ Backup created successfully!" -ForegroundColor Green
Write-Host "  Location: $ZipFile"
Write-Host "  Size: $FileSizeFormatted"
Write-Host "  Timestamp: $Timestamp"

# List recent backups
Write-Host ""
Write-Host "Recent backups:" -ForegroundColor Cyan
Get-ChildItem $BackupDir -Filter "*.zip" | 
    Sort-Object LastWriteTime -Descending | 
    Select-Object -First 5 | 
    ForEach-Object {
        $Size = $_.Length / 1MB
        Write-Host "  $($_.Name) - {0:N2} MB - $($_.LastWriteTime)" -f $Size
    }

