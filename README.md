Para desplegar la versión que hemos preparado en el servidor, una vez hayas subido el contenido de la carpeta deploy, debes ejecutar los siguientes comandos en la terminal de tu servidor (dentro de la carpeta del proyecto):

1. Preparar Dependencias de PHP
Instala las librerías necesarias omitiendo las de desarrollo para mayor eficiencia:

bash
composer install --optimize-autoloader --no-dev
2. Configurar Permisos
Asegúrate de que Laravel pueda escribir en las carpetas de caché y logs:

bash
chmod -R 775 storage bootstrap/cache
3. Configurar el Entorno (.env)
Si es una instalación nueva, copia el ejemplo y genera la llave (si ya tienes un 

.env
 configurado, puedes saltar este paso):

bash
cp .env.example .env
php artisan key:generate
Nota: Asegúrate de editar el 

.env
 con las credenciales de tu base de datos de producción.

4. Actualizar Base de Datos (Migraciones y Semillas)
Esto aplicará los cambios en las tablas y cargará los ejercicios base:

bash
php artisan migrate --force
php artisan db:seed --class=EjercicioSeeder --force
5. Optimización de Producción (Opcional pero Recomendado)
Limpia y cachea la configuración para que la app vuele:

bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
Importante: No necesitas ejecutar npm install ni npm run build en el servidor, ya que los archivos compilados ya están incluidos en la carpeta public/build que preparamos.

