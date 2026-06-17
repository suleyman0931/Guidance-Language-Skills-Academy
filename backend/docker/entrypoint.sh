#!/bin/sh
set -e

echo "==> Starting Guidance Academy API..."

cd /var/www/html

# Set PostgreSQL SSL mode to prefer (will try SSL but fall back if needed)
export PGSSLMODE=prefer
echo "==> PostgreSQL SSL mode set to: prefer"

# Check if APP_KEY is set, if not, generate it and export (but don't save to .env)
if [ -z "$APP_KEY" ]; then
  echo "==> APP_KEY not set, generating one..."
  # Generate a random key in the correct format
  export APP_KEY="base64:$(openssl rand -base64 32)"
  echo "==> Generated APP_KEY: $APP_KEY"
  echo "⚠️  WARNING: APP_KEY was generated at runtime. Set it as environment variable to persist!"
fi

# Discover packages (important after deployment)
echo "==> Discovering packages..."
php artisan package:discover --ansi || true

# DO NOT cache config in production - it breaks SSL and other runtime configs
echo "==> Skipping config cache to use runtime environment variables"

# Run migrations with SSL environment set
echo "==> Running migrations..."
php artisan migrate --force

# Create storage link
echo "==> Creating storage link..."
php artisan storage:link || true

# Seed only if users table is empty
USER_COUNT=$(php artisan tinker --execute="echo App\Models\User::count();" 2>/dev/null | tail -1 || echo "0")
if [ "$USER_COUNT" = "0" ]; then
  echo "==> Seeding database (first run)..."
  php artisan db:seed --force
fi

echo "==> Starting services..."
exec /usr/bin/supervisord -c /etc/supervisord.conf
