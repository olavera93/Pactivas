# Dockerfile para Producción (Pactivas)

# Etapa 1: Build de Assets de Frontend
FROM node:20-alpine AS build-assets
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Aplicación PHP + Servidor Web
FROM php:8.2-fpm-alpine

# Instalar dependencias del sistema y extensiones de PHP necesarias
RUN apk add --no-cache \
    nginx \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    zip \
    libzip-dev \
    unzip \
    git \
    oniguruma-dev \
    icu-dev

RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring gd zip opcache intl

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copiar aplicación
COPY . .
COPY --from=build-assets /app/public/build ./public/build

# Instalar dependencias de producción de PHP
RUN composer install --no-dev --optimize-autoloader

# Configuración de Nginx
COPY ./deploy/.htaccess /var/www/html/.htaccess
# Nota: En un entorno real, copiarías un archivo de config de nginx aquí.
# Por simplicidad en este script, asumimos que el usuario configurará su ingress/proxy.

# Permisos
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80

# Script de inicio (Se recomienda crear uno si se desea correr nginx y php-fpm juntos)
CMD ["php-fpm"]
