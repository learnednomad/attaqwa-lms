#!/usr/bin/env bash
# =============================================================================
# PostgreSQL Backup Script - AttaqwaMasjid LMS
# =============================================================================
# Usage (via docker compose):
#   docker compose -f docker-compose.yml -f docker-compose.prod.yml \
#     run --rm -v ./backups:/backups postgres \
#     /bin/bash -c "/backup/backup.sh"
#
# Or via Makefile:
#   make backup
#
# Environment variables:
#   POSTGRES_DB       - Database name (default: attaqwa_lms)
#   POSTGRES_USER     - Database user (default: postgres)
#   POSTGRES_PASSWORD - Database password (required)
#   BACKUP_RETENTION  - Days to keep backups (default: 30)
# =============================================================================

set -euo pipefail

# Configuration
DB_NAME="${POSTGRES_DB:-attaqwa_lms}"
DB_USER="${POSTGRES_USER:-postgres}"
DB_HOST="${DB_HOST:-postgres}"
DB_PORT="${DB_PORT:-5432}"
BACKUP_DIR="/backups"
RETENTION_DAYS="${BACKUP_RETENTION:-30}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql.gz"

echo "============================================"
echo "  AttaqwaMasjid LMS - Database Backup"
echo "============================================"
echo "Database: ${DB_NAME}"
echo "Host:     ${DB_HOST}:${DB_PORT}"
echo "Time:     $(date -Iseconds)"
echo "Output:   ${BACKUP_FILE}"
echo "--------------------------------------------"

# Ensure backup directory exists
mkdir -p "${BACKUP_DIR}"

# Run pg_dump with compression
echo "Starting backup..."
PGPASSWORD="${POSTGRES_PASSWORD}" pg_dump \
  -h "${DB_HOST}" \
  -p "${DB_PORT}" \
  -U "${DB_USER}" \
  -d "${DB_NAME}" \
  --format=plain \
  --no-owner \
  --no-privileges \
  --verbose 2>&1 | gzip > "${BACKUP_FILE}"

# Verify backup was created and has content
if [ ! -s "${BACKUP_FILE}" ]; then
  echo "ERROR: Backup file is empty or was not created."
  rm -f "${BACKUP_FILE}"
  exit 1
fi

BACKUP_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
echo "Backup complete: ${BACKUP_FILE} (${BACKUP_SIZE})"

# Cleanup old backups
echo "--------------------------------------------"
echo "Cleaning up backups older than ${RETENTION_DAYS} days..."
DELETED_COUNT=0
find "${BACKUP_DIR}" -name "${DB_NAME}_*.sql.gz" -type f -mtime "+${RETENTION_DAYS}" -print -delete | while read -r file; do
  DELETED_COUNT=$((DELETED_COUNT + 1))
  echo "  Deleted: $(basename "${file}")"
done

# List remaining backups
REMAINING=$(find "${BACKUP_DIR}" -name "${DB_NAME}_*.sql.gz" -type f | wc -l | tr -d ' ')
echo "Remaining backups: ${REMAINING}"
echo "============================================"
echo "  Backup completed successfully"
echo "============================================"
