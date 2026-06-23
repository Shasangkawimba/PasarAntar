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
# STAGE 2: Production PHP 8.4 + Nginx
# Alpine 3.22 has php84-* native packages = ZERO compilation
# ==========================================
FROM alpine:3.22

# Enable community repo and install PHP 8.4 + all needed extensions (pre-built, no compilation)
RUN echo "https://dl-cdn.alpinelinux.org/alpine/v3.22/community" >> /etc/apk/repositories \
    && apk add --no-cache \
       nginx git unzip curl bash dos2unix \
       php84 \
       php84-fpm \
       php84-pdo \
       php84-pdo_pgsql \
       php84-pgsql \
       php84-pecl-redis \
       php84-bcmath \
       php84-zip \
       php84-opcache \
       php84-pcntl \
       php84-mbstring \
       php84-xml \
       php84-dom \
       php84-simplexml \
       php84-xmlwriter \
       php84-xmlreader \
       php84-ctype \
       php84-tokenizer \
       php84-session \
       php84-openssl \
       php84-phar \
       php84-fileinfo \
       php84-curl \
       php84-iconv

# Create symlinks so 'php', 'php-fpm', and artisan work as expected
RUN ln -sf /usr/bin/php84 /usr/bin/php \
    && ln -sf /usr/sbin/php-fpm84 /usr/sbin/php-fpm84

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
    /run/nginx \
    /run/php-fpm \
    && touch /var/www/storage/logs/laravel.log

# Fix startup script line endings and make executable
RUN dos2unix /var/www/start-services.sh && chmod +x /var/www/start-services.sh

# World-writable for HF Spaces (runs as random non-root UID)
RUN chmod -R 777 \
    /var/www/storage \
    /var/www/bootstrap/cache \
    /var/lib/nginx \
    /var/log/nginx \
    /run/nginx \
    /run/php-fpm \
    /etc/nginx

EXPOSE 7860

CMD ["/bin/sh", "/var/www/start-services.sh"]
