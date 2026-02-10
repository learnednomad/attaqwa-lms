#!/usr/bin/env bash
# =============================================================================
# PostgreSQL Restore Script - AttaqwaMasjid LMS
# =============================================================================
# Usage (via docker compose):
#   docker compose -f docker-compose.yml -f docker-compose.prod.yml \
#     run --rm -v ./backups:/backups postgres \
#     /bin/bash -c "/backup/restore.sh /backups/<backup_file>.sql.gz"
#
# Or via Makefile:
#   make restore FILE=backups/attaqwa_lms_20240101_120000.sql.gz
#
# Environment variables:
#   POSTGRES_DB       - Database name (default: attaqwa_lms)
#   POSTGRES_USER     - Database user (default: postgres)
#   POSTGRES_PASSWORD - Database password (required)
# =============================================================================

set -euo pipefail

# Configuration
DB_NAME="${POSTGRES_DB:-attaqwa_lms}"
DB_USER="${POSTGRES_USER:-postgres}"
DB_HOST="${DB_HOST:-postgres}"
DB_PORT="${DB_PORT:-5432}"
BACKUP_FILE="${1:-}"

echo "============================================"
echo "  AttaqwaMasjid LMS - Database Restore"
echo "============================================"

# Validate input
if [ -z "${BACKUP_FILE}" ]; then
  echo "ERROR: No backup file specified."
  echo ""
  echo "Usage: restore.sh <backup_file.sql.gz>"
  echo ""
  echo "Available backups:"
  ls -lh /backups/*.sql.gz 2>/dev/null || echo "  No backups found in /backups/"
  exit 1
fi

if [ ! -f "${BACKUP_FILE}" ]; then
  echo "ERROR: Backup file not found: ${BACKUP_FILE}"
  exit 1
fi

BACKUP_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
echo "Database: ${DB_NAME}"
echo "Host:     ${DB_HOST}:${DB_PORT}"
echo "File:     ${BACKUP_FILE} (${BACKUP_SIZE})"
echo "Time:     $(date -Iseconds)"
echo "--------------------------------------------"
echo ""
echo "WARNING: This will DROP and RECREATE the database '${DB_NAME}'."
echo "All existing data will be lost!"
echo ""
echo "Press Ctrl+C within 5 seconds to abort..."
sleep 5

echo "Proceeding with restore..."

# Drop and recreate the database
echo "Dropping existing database..."
PGPASSWORD="${POSTGRES_PASSWORD}" psql \
  -h "${DB_HOST}" \
  -p "${DB_PORT}" \
  -U "${DB_USER}" \
  -d postgres \
  -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${DB_NAME}' AND pid <> pg_backend_pid();" \
  2>/dev/null || true

PGPASSWORD="${POSTGRES_PASSWORD}" psql \
  -h "${DB_HOST}" \
  -p "${DB_PORT}" \
  -U "${DB_USER}" \
  -d postgres \
  -c "DROP DATABASE IF EXISTS ${DB_NAME};"

echo "Creating fresh database..."
PGPASSWORD="${POSTGRES_PASSWORD}" psql \
  -h "${DB_HOST}" \
  -p "${DB_PORT}" \
  -U "${DB_USER}" \
  -d postgres \
  -c "CREATE DATABASE ${DB_NAME};"

# Ensure pgvector extension exists
PGPASSWORD="${POSTGRES_PASSWORD}" psql \
  -h "${DB_HOST}" \
  -p "${DB_PORT}" \
  -U "${DB_USER}" \
  -d "${DB_NAME}" \
  -c "CREATE EXTENSION IF NOT EXISTS vector;"

# Restore from backup
echo "Restoring from backup..."
gunzip -c "${BACKUP_FILE}" | PGPASSWORD="${POSTGRES_PASSWORD}" psql \
  -h "${DB_HOST}" \
  -p "${DB_PORT}" \
  -U "${DB_USER}" \
  -d "${DB_NAME}" \
  --set ON_ERROR_STOP=off \
  2>&1

echo "============================================"
echo "  Restore completed successfully"
echo "============================================"
echo "Database '${DB_NAME}' has been restored from:"
echo "  ${BACKUP_FILE}"
echo ""
echo "Verify with: make health"
