#!/bin/bash

# package-prod.sh - Genera un archivo ZIP con los archivos necesarios para producción
set -e

OUTPUT="pactivas_ready.zip"

echo "🎁 Generando paquete de producción en $OUTPUT..."

# Asegurarse de que los assets estén compilados
if [ ! -d public/build ]; then
    echo "⚠️  ADVERTENCIA: No se encuentra la carpeta public/build. Asegúrate de haber ejecutado ./build-prod.sh primero."
    exit 1
fi

# Eliminar paquete anterior si existe
rm -f $OUTPUT

# Comprimir archivos excluyendo lo innecesario para producción
zip -r $OUTPUT . -x \
    ".git/*" \
    "node_modules/*" \
    "storage/*.sqlite" \
    "tests/*" \
    "deploy/*" \
    ".env" \
    ".editorconfig" \
    ".gitattributes" \
    ".gitignore" \
    "pactivas_deploy.zip" \
    "package-prod.sh" \
    "pactivas_ready.zip" \
    "scratch/*" \
    "viva_deploy.zip"

echo "✅ Paquete generado con éxito: $OUTPUT"
echo "👉 Este archivo es el que debes subir a tu servidor."
