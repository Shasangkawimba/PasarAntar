#!/bin/sh
# NOTE: Written with LF line endings. Do NOT edit with Windows tools without converting back.

echo "=== Pasar Antar Startup ==="

# -------------------------------------------------------
# Generate .env from HF Spaces environment variables
# -------------------------------------------------------
echo ">>> Generating .env..."
printf 'APP_NAME="Pasar Antar"\n' > /var/www/.env
printf 'APP_ENV=production\n' >> /var/www/.env
printf 'APP_KEY=%s\n' "${APP_KEY}" >> /var/www/.env
printf 'APP_DEBUG=false\n' >> /var/www/.env
printf 'APP_URL=%s\n' "${APP_URL:-http://localhost:7860}" >> /var/www/.env
printf 'APP_LOCALE=en\n' >> /var/www/.env
printf 'APP_FALLBACK_LOCALE=en\n' >> /var/www/.env
printf 'APP_FAKER_LOCALE=en_US\n' >> /var/www/.env
printf 'APP_MAINTENANCE_DRIVER=file\n' >> /var/www/.env
printf 'BCRYPT_ROUNDS=12\n' >> /var/www/.env
printf 'LOG_CHANNEL=errorlog\n' >> /var/www/.env
printf 'LOG_DEPRECATIONS_CHANNEL=null\n' >> /var/www/.env
printf 'LOG_LEVEL=error\n' >> /var/www/.env
printf 'DB_CONNECTION=pgsql\n' >> /var/www/.env
printf 'DB_HOST=%s\n' "${DB_HOST}" >> /var/www/.env
printf 'DB_PORT=%s\n' "${DB_PORT:-5432}" >> /var/www/.env
printf 'DB_DATABASE=%s\n' "${DB_DATABASE}" >> /var/www/.env
printf 'DB_USERNAME=%s\n' "${DB_USERNAME}" >> /var/www/.env
printf 'DB_PASSWORD=%s\n' "${DB_PASSWORD}" >> /var/www/.env
printf 'SESSION_DRIVER=database\n' >> /var/www/.env
printf 'SESSION_LIFETIME=120\n' >> /var/www/.env
printf 'SESSION_ENCRYPT=false\n' >> /var/www/.env
printf 'SESSION_PATH=/\n' >> /var/www/.env
printf 'SESSION_DOMAIN=null\n' >> /var/www/.env
printf 'BROADCAST_CONNECTION=reverb\n' >> /var/www/.env
printf 'FILESYSTEM_DISK=local\n' >> /var/www/.env
printf 'QUEUE_CONNECTION=redis\n' >> /var/www/.env
printf 'CACHE_STORE=redis\n' >> /var/www/.env
printf 'REDIS_CLIENT=phpredis\n' >> /var/www/.env
printf 'REDIS_HOST=%s\n' "${REDIS_HOST}" >> /var/www/.env
printf 'REDIS_PASSWORD=%s\n' "${REDIS_PASSWORD:-null}" >> /var/www/.env
printf 'REDIS_PORT=%s\n' "${REDIS_PORT:-6379}" >> /var/www/.env
printf 'MAIL_MAILER=log\n' >> /var/www/.env
printf 'MAIL_FROM_ADDRESS=noreply@pasarantar.com\n' >> /var/www/.env
printf 'MAIL_FROM_NAME="Pasar Antar"\n' >> /var/www/.env
printf 'REVERB_APP_ID=%s\n' "${REVERB_APP_ID:-123456}" >> /var/www/.env
printf 'REVERB_APP_KEY=%s\n' "${REVERB_APP_KEY:-pasar_antar_key}" >> /var/www/.env
printf 'REVERB_APP_SECRET=%s\n' "${REVERB_APP_SECRET:-pasar_antar_secret}" >> /var/www/.env
printf 'REVERB_HOST=127.0.0.1\n' >> /var/www/.env
printf 'REVERB_PORT=8090\n' >> /var/www/.env
printf 'REVERB_SCHEME=http\n' >> /var/www/.env
printf 'VITE_REVERB_APP_KEY=%s\n' "${REVERB_APP_KEY:-pasar_antar_key}" >> /var/www/.env
printf 'VITE_REVERB_HOST=%s\n' "${APP_URL:-localhost}" >> /var/www/.env
printf 'VITE_REVERB_PORT=443\n' >> /var/www/.env
printf 'VITE_REVERB_SCHEME=https\n' >> /var/www/.env

echo ">>> .env generated. Contents:"
cat /var/www/.env

# -------------------------------------------------------
# Ensure writable directories exist
# -------------------------------------------------------
mkdir -p /var/www/storage/logs \
         /var/www/storage/framework/sessions \
         /var/www/storage/framework/views \
         /var/www/storage/framework/cache/data \
         /var/www/storage/app/public \
         /var/www/bootstrap/cache

chmod -R 777 /var/www/storage /var/www/bootstrap/cache

# Storage symlink
php artisan storage:link --force || true

# -------------------------------------------------------
# Wait for DB then migrate
# -------------------------------------------------------
echo ">>> Running migrations..."
php artisan migrate --force
if [ $? -ne 0 ]; then
    echo "ERROR: Migration failed. Check DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD env vars."
    exit 1
fi

# -------------------------------------------------------
# Cache optimization
# -------------------------------------------------------
echo ">>> Caching..."
php artisan config:cache || echo "WARN: config:cache failed, skipping"
php artisan route:cache  || echo "WARN: route:cache failed, skipping"
php artisan view:cache   || echo "WARN: view:cache failed, skipping"

# -------------------------------------------------------
# Start background services
# -------------------------------------------------------
echo ">>> Starting Reverb on 127.0.0.1:8090..."
php artisan reverb:start --host=127.0.0.1 --port=8090 >> /var/www/storage/logs/reverb.log 2>&1 &

echo ">>> Starting Queue Worker..."
php artisan queue:work redis --sleep=3 --tries=3 --timeout=90 >> /var/www/storage/logs/queue.log 2>&1 &

echo ">>> Starting Nginx..."
nginx -g "daemon off;" &

echo ">>> Starting PHP-FPM..."
exec php-fpm83 -F
