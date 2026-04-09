#!/bin/bash

# Script de inicio para Pausas Activas LFH

echo "🚀 Iniciando aplicación Pausas Activas (Laravel + React)..."

# 1. Verificar si existe el archivo .env
if [ ! -f .env ]; then
    echo "📄 Creando archivo .env a partir de .env.example..."
    cp .env.example .env
    php artisan key:generate
fi

# 2. Instalar dependencias si no existen (solo si es necesario)
if [ ! -d vendor ]; then
    echo "📦 Instalando dependencias de PHP (esto puede tardar)..."
    composer install
fi

if [ ! -d node_modules ]; then
    echo "📦 Instalando dependencias de Node.js..."
    npm install
fi

# 3. Preparar Base de Datos (SQLite)
if [ ! -f database/database.sqlite ]; then
    echo "🗄️ Creando base de datos SQLite..."
    touch database/database.sqlite
fi

echo "🔄 Ejecutando migraciones y cargando ejercicios..."
php artisan migrate --force
php artisan db:seed --class=EjercicioSeeder --force

# 4. Iniciar servidores
echo "✨ Todo listo! Abriendo aplicación..."
echo "👉 Abre http://localhost:8000 en tu navegador."

# Ejecutar el comando combinado definido en package.json
npm run start
