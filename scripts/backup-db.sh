#!/bin/bash

# Database Backup Script
# Creates a timestamped backup of the SQLite database

set -e

# Configuration
DB_PATH="prisma/dev.db"
BACKUP_DIR="backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/db_backup_${TIMESTAMP}.db"

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

# Check if database exists
if [ ! -f "${DB_PATH}" ]; then
    echo "Error: Database file not found at ${DB_PATH}"
    exit 1
fi

# Create backup
echo "Creating database backup..."
cp "${DB_PATH}" "${BACKUP_FILE}"

# Compress backup
echo "Compressing backup..."
gzip -f "${BACKUP_FILE}"
BACKUP_FILE="${BACKUP_FILE}.gz"

# Get file size
FILE_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)

echo "✓ Backup created successfully!"
echo "  Location: ${BACKUP_FILE}"
echo "  Size: ${FILE_SIZE}"
echo "  Timestamp: ${TIMESTAMP}"

# List recent backups
echo ""
echo "Recent backups:"
ls -lh "${BACKUP_DIR}"/*.db.gz 2>/dev/null | tail -5 || echo "No previous backups found"

