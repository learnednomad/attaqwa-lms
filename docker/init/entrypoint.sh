#!/bin/sh
# =============================================================================
# Init Container Entrypoint - AttaqwaMasjid LMS
# =============================================================================
# Runs all first-time setup tasks against the database:
#   1. Wait for PostgreSQL to be ready
#   2. Run BetterAuth migrations (create user/session/account/verification tables)
#   3. Seed default user accounts (superadmin, masjid admin, teacher, student)
#   4. Migrate Strapi users to BetterAuth (if up_users table exists)
#
# Idempotent — safe to run on every deploy.
# =============================================================================

set -e

echo "=== AttaqwaMasjid LMS Init ==="
echo "Timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)"

# ---------------------------------------------------------------------------
# 1. Wait for PostgreSQL
# ---------------------------------------------------------------------------
echo ""
echo "[1/4] Waiting for PostgreSQL..."

RETRIES=30
until pg_isready -h "$DATABASE_HOST" -p "${DATABASE_PORT:-5432}" -U "${DATABASE_USERNAME:-postgres}" > /dev/null 2>&1; do
  RETRIES=$((RETRIES - 1))
  if [ "$RETRIES" -le 0 ]; then
    echo "FATAL: PostgreSQL not reachable after 30 attempts. Exiting."
    exit 1
  fi
  echo "  Waiting for postgres ($RETRIES retries left)..."
  sleep 2
done
echo "  PostgreSQL is ready."

# ---------------------------------------------------------------------------
# 2. BetterAuth schema migration
# ---------------------------------------------------------------------------
echo ""
echo "[2/4] Running BetterAuth migrations..."

cd /app/apps/website
npx auth@latest migrate --yes 2>&1
echo "  BetterAuth migration complete."

# ---------------------------------------------------------------------------
# 3. Seed default user accounts (development only)
# ---------------------------------------------------------------------------
echo ""
echo "[3/4] Seeding default user accounts..."

if [ "$NODE_ENV" = "production" ]; then
  echo "  SKIP: Production environment — create accounts manually via admin UI."
else
  cd /app
  psql "$DATABASE_URL" -f scripts/seed-auth-users.sql 2>&1
fi

# ---------------------------------------------------------------------------
# 4. Migrate Strapi users to BetterAuth (one-time, idempotent)
# ---------------------------------------------------------------------------
echo ""
echo "[4/4] Checking for Strapi user migration..."

STRAPI_USERS=$(psql "$DATABASE_URL" -tAc \
  "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'up_users');" 2>/dev/null || echo "f")

if [ "$STRAPI_USERS" = "t" ]; then
  UNMIGRATED=$(psql "$DATABASE_URL" -tAc \
    "SELECT COUNT(*) FROM up_users u WHERE NOT EXISTS (SELECT 1 FROM \"user\" ba WHERE ba.email = u.email);" 2>/dev/null || echo "0")

  if [ "$UNMIGRATED" -gt 0 ]; then
    echo "  Found $UNMIGRATED unmigrated Strapi users. Migrating..."
    node --import tsx scripts/migrate-users-to-betterauth.ts 2>&1
    echo "  Strapi user migration complete."
  else
    echo "  All Strapi users already migrated. Skipping."
  fi
else
  echo "  No Strapi up_users table found. Skipping."
fi

echo ""
echo "=== Init complete ==="
