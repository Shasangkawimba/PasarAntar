# ==========================================
# STAGE 1: Frontend Asset Builder
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app

COPY package.json package-lock.json tsconfig.json vite.config.js tailwind.config.js postcss.config.js ./
COPY resources ./resources
COPY public ./public

RUN npm ci --legacy-peer-deps && npm run build

# ==========================================
# STAGE 2: Production PHP + Nginx Container
# ==========================================
FROM php:8.3-fpm-alpine

# Install system dependencies including dos2unix to fix Windows line endings
RUN apk add --no-cache nginx git unzip curl bash dos2unix

# Install PHP extensions
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/
ENV MAKEFLAGS="-j2"
RUN install-php-extensions pdo_pgsql pgsql redis bcmath gd zip intl opcache pcntl

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy application source
COPY . /var/www

# Copy compiled frontend assets from Stage 1
COPY --from=frontend-builder /app/public/build /var/www/public/build

# Install PHP production dependencies
RUN composer install --no-interaction --no-dev --optimize-autoloader

# Copy Nginx config and fix its line endings
COPY nginx-prod.conf /etc/nginx/http.d/default.conf
RUN dos2unix /etc/nginx/http.d/default.conf

# Create all required Laravel directories
RUN mkdir -p /var/www/storage/logs \
             /var/www/storage/framework/sessions \
             /var/www/storage/framework/views \
             /var/www/storage/framework/cache/data \
             /var/www/storage/app/public \
             /var/www/bootstrap/cache \
             /var/lib/nginx/tmp \
             /var/log/nginx \
             /run/nginx

# Pre-create the log file
RUN touch /var/www/storage/logs/laravel.log

# Fix Windows line endings on the startup script, then make executable
RUN dos2unix /var/www/start-services.sh && chmod +x /var/www/start-services.sh

# Make everything world-writable (HF Spaces runs as random non-root UID)
RUN chmod -R 777 /var/www/storage \
                 /var/www/bootstrap/cache \
                 /var/lib/nginx \
                 /var/log/nginx \
                 /run/nginx \
                 /etc/nginx

EXPOSE 7860

CMD ["/bin/sh", "/var/www/start-services.sh"]
