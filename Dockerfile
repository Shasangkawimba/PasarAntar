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

# Install system packages + PHP build dependencies (all pre-compiled by Alpine)
RUN apk add --no-cache \
    nginx git unzip curl bash dos2unix \
    libpng-dev libjpeg-turbo-dev freetype-dev \
    libzip-dev icu-dev postgresql-dev

# Install bundled PHP extensions (uses pre-compiled Alpine libs — fast)
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo_pgsql pgsql bcmath gd zip intl opcache pcntl

# Install Redis extension via PECL (only this one needs compilation)
RUN pecl install redis && docker-php-ext-enable redis

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy application source
COPY . /var/www

# Copy compiled frontend assets from Stage 1
COPY --from=frontend-builder /app/public/build /var/www/public/build

# Install PHP production dependencies
RUN composer install --no-interaction --no-dev --optimize-autoloader

# Setup Nginx
COPY nginx-prod.conf /etc/nginx/http.d/default.conf
RUN dos2unix /etc/nginx/http.d/default.conf

# Create all required Laravel directories
RUN mkdir -p \
    /var/www/storage/logs \
    /var/www/storage/framework/sessions \
    /var/www/storage/framework/views \
    /var/www/storage/framework/cache/data \
    /var/www/storage/app/public \
    /var/www/bootstrap/cache \
    /var/lib/nginx/tmp \
    /var/log/nginx \
    /run/nginx

RUN touch /var/www/storage/logs/laravel.log

# Fix startup script line endings and permissions
RUN dos2unix /var/www/start-services.sh && chmod +x /var/www/start-services.sh

# World-writable for HF Spaces (runs as random non-root UID)
RUN chmod -R 777 \
    /var/www/storage \
    /var/www/bootstrap/cache \
    /var/lib/nginx \
    /var/log/nginx \
    /run/nginx \
    /etc/nginx

EXPOSE 7860

CMD ["/bin/sh", "/var/www/start-services.sh"]
