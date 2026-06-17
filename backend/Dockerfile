FROM php:8.3-fpm-alpine

RUN apk add --no-cache \
    nginx supervisor curl \
    libpng-dev libjpeg-turbo-dev freetype-dev \
    libzip-dev zip unzip git \
    oniguruma-dev icu-dev \
    postgresql-dev postgresql-client

RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_pgsql pgsql mbstring exif pcntl bcmath gd zip intl opcache

COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy composer files first
COPY composer.json composer.lock* ./

# Copy application files needed for composer scripts
COPY artisan ./
COPY bootstrap/ bootstrap/
COPY config/ config/
COPY database/ database/
COPY app/ app/
COPY routes/ routes/
COPY public/ public/

# Install dependencies (skip scripts during install, run them after)
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction \
    --no-scripts \
    --prefer-dist

# Now run the autoload dump which triggers package discovery
RUN composer dump-autoload --optimize --no-scripts

# Copy docker configuration files
COPY docker/ docker/

# Create necessary directories and set permissions
RUN mkdir -p storage/framework/{cache,sessions,views} \
             storage/logs \
             bootstrap/cache \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 755 storage bootstrap/cache

COPY docker/nginx.conf       /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisord.conf
COPY docker/php-fpm.conf     /usr/local/etc/php-fpm.d/www.conf
COPY docker/php.ini          /usr/local/etc/php/conf.d/app.ini
COPY docker/entrypoint.sh    /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]
