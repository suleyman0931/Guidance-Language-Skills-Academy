#!/bin/sh
set -e

echo "==> Starting Guidance Academy API..."

cd /var/www/html

# Generate APP_KEY if not set
if [ -z "$APP_KEY" ]; then
  echo "==> Generating APP_KEY..."
  php artisan key:generate --force
fi

# Cache config for performance
echo "==> Caching configuration..."
php artisan config:cache || true
php artisan route:cache  || true
php artisan view:cache   || true

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
