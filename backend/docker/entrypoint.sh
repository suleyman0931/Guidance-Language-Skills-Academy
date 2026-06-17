#!/bin/sh
set -e

echo "==> Starting Guidance Academy API..."

cd /var/www/html

# Parse DATABASE_URL if set and extract components
if [ -n "$DATABASE_URL" ]; then
  echo "==> Using DATABASE_URL for database connection"
  # Set PGSSLMODE environment variable for PostgreSQL client
  export PGSSLMODE=require
fi

# Set PostgreSQL SSL mode if not already set
if [ -z "$PGSSLMODE" ] && [ "$DB_CONNECTION" = "pgsql" ]; then
  export PGSSLMODE=require
  echo "==> Set PGSSLMODE=require for PostgreSQL"
fi

# Generate APP_KEY if not set
if [ -z "$APP_KEY" ]; then
  echo "==> Generating APP_KEY..."
  php artisan key:generate --force
fi

# Discover packages (important after deployment)
echo "==> Discovering packages..."
php artisan package:discover --ansi || true

# Cache config for performance (only in production)
if [ "$APP_ENV" = "production" ]; then
  echo "==> Caching configuration..."
  php artisan config:cache || true
  php artisan route:cache  || true
  php artisan view:cache   || true
fi

# Run migrations
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
