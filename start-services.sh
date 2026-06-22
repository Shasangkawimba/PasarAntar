#!/bin/sh

echo "Starting deployment preparation..."

# Clear old caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Run database migrations
echo "Running database migrations..."
php artisan migrate --force

# Optimize Laravel for production
echo "Caching configurations..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start Laravel Reverb (Websockets) on port 8090 (internal)
echo "Starting Laravel Reverb..."
php artisan reverb:start --host=127.0.0.1 --port=8090 > /dev/null 2>&1 &

# Start Queue Worker
echo "Starting Laravel Queue Worker..."
php artisan queue:work redis --sleep=3 --tries=3 --timeout=90 > /dev/null 2>&1 &

# Start Nginx in background
echo "Starting Nginx..."
nginx -g "daemon on;"

# Start PHP-FPM in foreground to keep container alive
echo "Starting PHP-FPM..."
exec php-fpm
