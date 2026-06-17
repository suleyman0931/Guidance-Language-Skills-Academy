#!/bin/sh
set -e

echo "==> Starting Guidance Academy API..."

cd /var/www/html

# Set PostgreSQL SSL mode BEFORE anything else
export PGSSLMODE=require
export PGSSLROOTCERT=system
echo "==> PostgreSQL SSL mode set to: require"

# Generate APP_KEY if not set
if [ -z "$APP_KEY" ]; then
  echo "==> Generating APP_KEY..."
  php artisan key:generate --force
fi

# Discover packages (important after deployment)
echo "==> Discovering packages..."
php artisan package:discover --ansi || true

# DO NOT cache config in production - it breaks SSL and other runtime configs
# Cache will use whatever is in .env at build time, not runtime env vars
echo "==> Skipping config cache to use runtime environment variables"

# Run migrations with SSL environment set
echo "==> Running migrations..."
php artisan migrate --force

# Seed only if users table is empty
USER_COUNT=$(php artisan tinker --execute="echo App\Models\User::count();" 2>/dev/null | tail -1 || echo "0")
if [ "$USER_COUNT" = "0" ]; then
  echo "==> Seeding database (first run)..."
  php artisan db:seed --force
fi

echo "==> Starting services..."
exec /usr/bin/supervisord -c /etc/supervisord.conf
