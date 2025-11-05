# Database Restore Script (PowerShell)
# Restores the SQLite database from a backup file

param(
    [string]$DbPath = "prisma/dev.db",
    [string]$BackupDir = "backups"
)

# Check if backup directory exists
if (-not (Test-Path $BackupDir)) {
    Write-Host "Error: Backup directory not found at $BackupDir" -ForegroundColor Red
    exit 1
}

# List available backups
Write-Host "Available backups:" -ForegroundColor Cyan
Write-Host ""

$Backups = Get-ChildItem $BackupDir -Filter "*.zip" | Sort-Object LastWriteTime -Descending

if ($Backups.Count -eq 0) {
    Write-Host "No backups found in $BackupDir" -ForegroundColor Red
    exit 1
}

$Index = 1
foreach ($Backup in $Backups) {
    $Size = $Backup.Length / 1MB
    Write-Host "$Index. $($Backup.Name) - {0:N2} MB - $($Backup.LastWriteTime)" -f $Size
    $Index++
}

Write-Host ""
$BackupChoice = Read-Host "Enter backup number to restore (or 'latest' for most recent)"

# Get backup file
if ($BackupChoice -eq "latest") {
    $BackupFile = $Backups[0]
} else {
    $BackupIndex = [int]$BackupChoice - 1
    if ($BackupIndex -lt 0 -or $BackupIndex -ge $Backups.Count) {
        Write-Host "Error: Invalid backup selection" -ForegroundColor Red
        exit 1
    }
    $BackupFile = $Backups[$BackupIndex]
}

Write-Host ""
Write-Host "Selected backup: $($BackupFile.Name)"
Write-Host ""
$Confirm = Read-Host "Are you sure you want to restore this backup? This will overwrite the current database. (yes/no)"

if ($Confirm -ne "yes") {
    Write-Host "Restore cancelled." -ForegroundColor Yellow
    exit 0
}

# Create backup of current database before restore
if (Test-Path $DbPath) {
    $CurrentBackup = Join-Path $BackupDir "pre_restore_$(Get-Date -Format 'yyyyMMdd_HHmmss').db"
    Write-Host "Creating backup of current database..." -ForegroundColor Cyan
    Copy-Item $DbPath $CurrentBackup
    Write-Host "Current database backed up to: $CurrentBackup" -ForegroundColor Green
}

# Extract and restore
Write-Host "Restoring backup..." -ForegroundColor Cyan
$TempDir = Join-Path $env:TEMP "db_restore_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
New-Item -ItemType Directory -Path $TempDir | Out-Null

try {
    Expand-Archive -Path $BackupFile.FullName -DestinationPath $TempDir -Force
    $ExtractedDb = Get-ChildItem $TempDir -Filter "*.db" | Select-Object -First 1
    
    if ($ExtractedDb) {
        Copy-Item $ExtractedDb.FullName $DbPath -Force
        Write-Host ""
        Write-Host "✓ Database restored successfully!" -ForegroundColor Green
        Write-Host "  Source: $($BackupFile.Name)"
        Write-Host "  Destination: $DbPath"
    } else {
        Write-Host "Error: Database file not found in backup archive" -ForegroundColor Red
        exit 1
    }
} finally {
    Remove-Item $TempDir -Recurse -Force -ErrorAction SilentlyContinue
}

