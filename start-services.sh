#!/bin/bash

set -e

echo "=== Pasar Antar Startup ==="

# -------------------------------------------------------
# Generate .env from environment variables (HF Spaces)
# -------------------------------------------------------
echo ">>> Generating .env..."
cat > /var/www/.env << EOF
APP_NAME="Pasar Antar"
APP_ENV=production
APP_KEY=${APP_KEY}
APP_DEBUG=false
APP_URL=${APP_URL:-http://localhost:7860}

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file

BCRYPT_ROUNDS=12

LOG_CHANNEL=stderr
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=pgsql
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT:-5432}
DB_DATABASE=${DB_DATABASE}
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_CONNECTION=reverb
FILESYSTEM_DISK=local
QUEUE_CONNECTION=redis

CACHE_STORE=redis

REDIS_CLIENT=phpredis
REDIS_HOST=${REDIS_HOST}
REDIS_PASSWORD=${REDIS_PASSWORD:-null}
REDIS_PORT=${REDIS_PORT:-6379}

MAIL_MAILER=log
MAIL_FROM_ADDRESS="noreply@pasarantar.com"
MAIL_FROM_NAME="Pasar Antar"

REVERB_APP_ID=${REVERB_APP_ID:-123456}
REVERB_APP_KEY=${REVERB_APP_KEY:-pasar_antar_key}
REVERB_APP_SECRET=${REVERB_APP_SECRET:-pasar_antar_secret}
REVERB_HOST=127.0.0.1
REVERB_PORT=8090
REVERB_SCHEME=http

VITE_REVERB_APP_KEY=${REVERB_APP_KEY:-pasar_antar_key}
VITE_REVERB_HOST=${APP_URL:-localhost}
VITE_REVERB_PORT=443
VITE_REVERB_SCHEME=https
EOF

# -------------------------------------------------------
# Ensure writable directories exist
# -------------------------------------------------------
mkdir -p /var/www/storage/logs \
         /var/www/storage/framework/sessions \
         /var/www/storage/framework/views \
         /var/www/storage/framework/cache/data \
         /var/www/storage/app/public \
         /var/www/bootstrap/cache

chmod -R 777 /var/www/storage /var/www/bootstrap/cache 2>/dev/null || true

# Create storage symlink
php artisan storage:link --force 2>/dev/null || true

# -------------------------------------------------------
# Database migrations
# -------------------------------------------------------
echo ">>> Running migrations..."
php artisan migrate --force

# -------------------------------------------------------
# Cache optimization
# -------------------------------------------------------
echo ">>> Caching..."
php artisan config:cache  || echo "config:cache skipped"
php artisan route:cache   || echo "route:cache skipped"
php artisan view:cache    || echo "view:cache skipped"

# -------------------------------------------------------
# Start background services
# -------------------------------------------------------
echo ">>> Starting Reverb on 127.0.0.1:8090..."
php artisan reverb:start --host=127.0.0.1 --port=8090 >> /var/www/storage/logs/reverb.log 2>&1 &

echo ">>> Starting Queue Worker..."
php artisan queue:work redis --sleep=3 --tries=3 --timeout=90 >> /var/www/storage/logs/queue.log 2>&1 &

echo ">>> Starting Nginx..."
nginx -g "daemon off;" &

# -------------------------------------------------------
# Start PHP-FPM in foreground (keeps container alive)
# -------------------------------------------------------
echo ">>> Starting PHP-FPM..."
exec php-fpm
