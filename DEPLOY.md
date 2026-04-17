# Guía de Despliegue - Pactivas LFH

Esta guía detalla los pasos para poner en producción la aplicación utilizando los scripts y configuraciones generados.

## 📋 Requisitos Previos

- **Servidor:** PHP 8.2+, Node.js 20+, Composer 2.x.
- **Base de Datos:** SQLite (por defecto) o MySQL/PostgreSQL.
- **Servidor Web:** Nginx o Apache configurado para apuntar a la carpeta `public/`.

---

## 🚀 Opción 1: Despliegue Manual (Linux/VPS)

### 1. Preparar el Entorno
Ejecuta el script de construcción para instalar dependencias y compilar assets:
```bash
chmod +x build-prod.sh optimize-laravel.sh
./build-prod.sh
```

### 2. Configurar Variables
Copia el archivo `.env.example` y configura tus valores reales:
```bash
cp .env.example .env
php artisan key:generate
```
> [!IMPORTANT]
> Asegúrate de cambiar `APP_URL`, `DB_DATABASE` y desactivar `APP_DEBUG=false`.

### 3. Optimizar
Ejecuta el script de optimización para mejorar el rendimiento:
```bash
./optimize-laravel.sh
```

---

## 🐳 Opción 2: Despliegue con Docker

Si usas Docker, el proceso es mucho más sencillo:

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```
Esto levantará la aplicación en el puerto `8080`.

---

## 🛠️ Mantenimiento y Logs

- **Logs de App:** `storage/logs/laravel.log`
- **Caché:** Si realizas cambios en el código, vuelve a ejecutar `./optimize-laravel.sh`.
- **Permisos:** La carpeta `storage` y `bootstrap/cache` deben tener permisos de escritura para el usuario del servidor web.

---

## ✅ Lista de Verificación Final
- [x] Assets compilados en `public/build/`.
- [x] `APP_DEBUG` en `false`.
- [x] Base de datos migrada (`php artisan migrate --force`).
- [x] Enlace simbólico de storage creado (`php artisan storage:link`).
