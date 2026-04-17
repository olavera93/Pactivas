#!/bin/bash

# optimize-laravel.sh - Script de optimización de backend para producción
set -e

echo "⚡ Optimizando Laravel para PRODUCCIÓN..."

# 1. Caché de configuración y rutas
echo "⚙️  Generando caché de configuración, rutas y vistas..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# 2. Otros comandos de producción
echo "🔗 Limpiando y regenerando enlaces simbólicos..."
php artisan storage:link || echo "Aviso: El enlace de storage ya existe."

echo "✅ Optimización completada."
echo "🚀 La aplicación ya puede ser servida."
