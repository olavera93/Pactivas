#!/bin/bash

# build-prod.sh - Script de construcción para producción (Pactivas)
set -e

echo "🚀 Iniciando proceso de construcción para PRODUCCIÓN..."

# 1. Limpiar caches de construcción anteriores
echo "🧹 Limpiando directorios temporales..."
rm -rf public/build
rm -rf node_modules

# 2. Instalar dependencias de producción
echo "📦 Instalando dependencias de Node.js..."
npm install

echo "📦 Instalando dependencias de PHP (sin dev)..."
composer install --no-dev --optimize-autoloader

# 3. Compilar Assets para producción
echo "✨ Compilando assets con Vite..."
npm run build

# 4. Preparar directorios de almacenamiento
echo "📂 Asegurando permisos de storage y bootstrap/cache..."
chmod -R 775 storage bootstrap/cache
mkdir -p storage/framework/{sessions,views,cache}

echo "✅ Construcción completada con éxito."
echo "👉 Ahora ejecuta ./optimize-laravel.sh para optimizar el backend."
