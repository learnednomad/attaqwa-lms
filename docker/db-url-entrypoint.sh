#!/bin/sh
# =============================================================================
# DATABASE_URL builder — AttaqwaMasjid LMS
# =============================================================================
# Constructs DATABASE_URL from split env vars, URL-encoding the password so
# that arbitrary characters (/, +, =, @, :, ?, #, &) round-trip cleanly
# through every URL parser. Avoids the encoded-vs-raw mismatch that lets
# Postgres store one literal while clients connect with another.
#
# If DATABASE_URL is already set (e.g. from CI), it is left alone — this
# shim is purely a safety net for the deploy path that ships only split
# fields (DATABASE_HOST/PORT/USERNAME/NAME/PASSWORD).
# =============================================================================

set -eu

if [ -z "${DATABASE_URL:-}" ]; then
  : "${DATABASE_PASSWORD:?DATABASE_PASSWORD is required when DATABASE_URL is unset}"
  : "${DATABASE_HOST:?DATABASE_HOST is required when DATABASE_URL is unset}"

  ENCODED=$(node -e 'process.stdout.write(encodeURIComponent(process.env.DATABASE_PASSWORD))')
  DATABASE_URL="postgresql://${DATABASE_USERNAME:-postgres}:${ENCODED}@${DATABASE_HOST}:${DATABASE_PORT:-5432}/${DATABASE_NAME:-attaqwa_lms}"
  export DATABASE_URL
fi

exec "$@"
