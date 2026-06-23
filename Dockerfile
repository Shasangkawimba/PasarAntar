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
# Using Alpine native PHP packages = ZERO compilation, installs in seconds
# ==========================================
FROM alpine:3.21

# Enable community repo (needed for php83-pecl-redis) and install everything
RUN echo "https://dl-cdn.alpinelinux.org/alpine/v3.21/community" >> /etc/apk/repositories \
    && apk add --no-cache \
       nginx git unzip curl bash dos2unix \
       php83 \
       php83-fpm \
       php83-pdo \
       php83-pdo_pgsql \
       php83-pgsql \
       php83-pecl-redis \
       php83-bcmath \
       php83-zip \
       php83-opcache \
       php83-pcntl \
       php83-mbstring \
       php83-xml \
       php83-dom \
       php83-simplexml \
       php83-xmlwriter \
       php83-xmlreader \
       php83-ctype \
       php83-tokenizer \
       php83-session \
       php83-openssl \
       php83-phar \
       php83-fileinfo \
       php83-curl \
       php83-iconv

# Create symlinks so 'php' and 'php-fpm' commands work as expected
RUN ln -sf /usr/bin/php83 /usr/bin/php \
    && ln -sf /usr/sbin/php-fpm83 /usr/sbin/php-fpm

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
