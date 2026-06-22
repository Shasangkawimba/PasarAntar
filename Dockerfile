# ==========================================
# STAGE 1: Frontend Asset Builder
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app

# Copy files required to install dependencies and build
COPY package.json package-lock.json tsconfig.json vite.config.js tailwind.config.js postcss.config.js ./
COPY resources ./resources
COPY public ./public

# Install dependencies and build assets
RUN npm ci --legacy-peer-deps
RUN npm run build

# ==========================================
# STAGE 2: Production PHP + Nginx Container
# ==========================================
FROM php:8.3-fpm-alpine

# Install Nginx and other system utilities
RUN apk add --no-cache nginx git unzip curl

# Install PHP Extension Installer helper
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/

# Limit compilation parallel jobs to prevent OOM (Out of Memory)
ENV MAKEFLAGS="-j2"

# Install PHP extensions required by Laravel, PostgreSQL, and Redis
RUN install-php-extensions pdo_pgsql pgsql redis bcmath gd zip intl opcache pcntl

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy all backend source files
COPY . /var/www

# Copy compiled frontend assets from Stage 1
COPY --from=frontend-builder /app/public/build /var/www/public/build

# Install PHP Production dependencies
RUN composer install --no-interaction --no-dev --optimize-autoloader

# Setup Nginx Configuration
COPY nginx-prod.conf /etc/nginx/http.d/default.conf

# Fix permissions for Laravel storage & bootstrap cache
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
RUN chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Make the service startup script executable
RUN chmod +x /var/www/start-services.sh

# Expose Nginx port
EXPOSE 7860

# Start services
CMD ["/var/www/start-services.sh"]
