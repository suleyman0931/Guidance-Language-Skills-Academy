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

# Temporarily enable debug mode to diagnose issues
export APP_DEBUG=true
export APP_ENV=production
echo "==> Debug mode enabled for diagnostics"

# Discover packages (important after deployment)
echo "==> Discovering packages..."
php artisan package:discover --ansi || true

# DO NOT cache config in production - it breaks SSL and other runtime configs
echo "==> Skipping config cache to use runtime environment variables"

# Run migrations with SSL environment set
echo "==> Running migrations..."
php artisan migrate --force

# Check if registrations table actually exists
echo "==> Verifying database tables..."
TABLE_CHECK=$(php artisan tinker --execute="try { echo \DB::table('registrations')->count(); } catch (\Exception \$e) { echo 'ERROR'; }" 2>&1 | tail -1)

if [ "$TABLE_CHECK" = "ERROR" ] || [ -z "$TABLE_CHECK" ]; then
  echo "⚠️  Tables missing! Running fresh migration..."
  php artisan migrate:fresh --seed --force
else
  echo "✅ Database tables verified"
fi

# Create storage directories with proper permissions
echo "==> Ensuring storage directories exist..."
mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs
mkdir -p storage/app/public/promotional_images
chown -R www-data:www-data storage
chmod -R 775 storage

# Create storage link
echo "==> Creating storage link..."
php artisan storage:link || true

echo "==> Database setup complete!"

echo "==> Starting services..."
exec /usr/bin/supervisord -c /etc/supervisord.conf
