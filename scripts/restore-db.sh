#!/bin/bash

# Database Restore Script
# Restores the SQLite database from a backup file

set -e

# Configuration
DB_PATH="prisma/dev.db"
BACKUP_DIR="backups"

# Check if backup directory exists
if [ ! -d "${BACKUP_DIR}" ]; then
    echo "Error: Backup directory not found at ${BACKUP_DIR}"
    exit 1
fi

# List available backups
echo "Available backups:"
echo ""
ls -lh "${BACKUP_DIR}"/*.db.gz 2>/dev/null | nl -w2 -s'. ' || {
    echo "No backups found in ${BACKUP_DIR}"
    exit 1
}

echo ""
read -p "Enter backup number to restore (or 'latest' for most recent): " BACKUP_CHOICE

# Get backup file
if [ "${BACKUP_CHOICE}" = "latest" ]; then
    BACKUP_FILE=$(ls -t "${BACKUP_DIR}"/*.db.gz 2>/dev/null | head -1)
else
    BACKUP_FILE=$(ls -t "${BACKUP_DIR}"/*.db.gz 2>/dev/null | sed -n "${BACKUP_CHOICE}p")
fi

if [ -z "${BACKUP_FILE}" ] || [ ! -f "${BACKUP_FILE}" ]; then
    echo "Error: Invalid backup selection"
    exit 1
fi

echo ""
echo "Selected backup: ${BACKUP_FILE}"
echo ""
read -p "Are you sure you want to restore this backup? This will overwrite the current database. (yes/no): " CONFIRM

if [ "${CONFIRM}" != "yes" ]; then
    echo "Restore cancelled."
    exit 0
fi

# Create backup of current database before restore
if [ -f "${DB_PATH}" ]; then
    CURRENT_BACKUP="${BACKUP_DIR}/pre_restore_$(date +%Y%m%d_%H%M%S).db"
    echo "Creating backup of current database..."
    cp "${DB_PATH}" "${CURRENT_BACKUP}"
    echo "Current database backed up to: ${CURRENT_BACKUP}"
fi

# Decompress and restore
echo "Restoring backup..."
gunzip -c "${BACKUP_FILE}" > "${DB_PATH}"

echo ""
echo "✓ Database restored successfully!"
echo "  Source: ${BACKUP_FILE}"
echo "  Destination: ${DB_PATH}"

