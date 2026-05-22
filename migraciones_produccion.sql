-- ============================================================
-- MIGRACIONES PENDIENTES PARA PRODUCCIÓN
-- Ejecutar en phpMyAdmin sobre la base de datos de producción
-- Fecha: 2026-05-21
-- ============================================================

-- 1. Tabla anuncios
CREATE TABLE IF NOT EXISTS `anuncios` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(255) NOT NULL,
  `imagen` VARCHAR(255) NOT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabla documentos
CREATE TABLE IF NOT EXISTS `documentos` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(255) NOT NULL,
  `descripcion` TEXT NULL,
  `archivo` VARCHAR(255) NOT NULL,
  `estado` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabla documento_accesos
CREATE TABLE IF NOT EXISTS `documento_accesos` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `documento_id` BIGINT UNSIGNED NOT NULL,
  `cedula_colaborador` VARCHAR(20) NULL,
  `nombre_colaborador` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_doc_accesos_documento` FOREIGN KEY (`documento_id`) REFERENCES `documentos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabla turnos (con compensatorio)
CREATE TABLE IF NOT EXISTS `turnos` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre_colaborador` VARCHAR(255) NOT NULL,
  `documento_colaborador` VARCHAR(255) NULL,
  `fecha` DATE NOT NULL,
  `hora_inicio` TIME NOT NULL,
  `hora_fin` TIME NOT NULL,
  `estado` ENUM('asiste','ausente','permiso','vacaciones','incapacidad','compensatorio') NOT NULL DEFAULT 'asiste',
  `observacion` TEXT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Agregar columna activo a colaboradors (si no existe)
ALTER TABLE `colaboradors`
  ADD COLUMN IF NOT EXISTS `activo` TINYINT(1) NOT NULL DEFAULT 1 AFTER `area`;

-- 6. Eliminar nombre_autorizador de horas_extras (si existe)
ALTER TABLE `horas_extras`
  DROP COLUMN IF EXISTS `nombre_autorizador`;

-- 7. Eliminar columnas obsoletas de oportunidades_mejora (si existen)
ALTER TABLE `oportunidades_mejora`
  DROP COLUMN IF EXISTS `impacto`,
  DROP COLUMN IF EXISTS `nombre_socializador`,
  DROP COLUMN IF EXISTS `nombre_receptor`,
  DROP COLUMN IF EXISTS `area`;

-- 8. Registrar migraciones en la tabla migrations
INSERT IGNORE INTO `migrations` (`migration`, `batch`)
SELECT m.migration, COALESCE((SELECT MAX(`batch`) FROM `migrations`), 0) + 1
FROM (
  SELECT '2026_05_06_000001_create_documentos_table' AS migration
  UNION SELECT '2026_05_06_000002_create_documento_accesos_table'
  UNION SELECT '2026_05_07_000001_create_anuncios_table'
  UNION SELECT '2026_05_07_000002_create_turnos_table'
  UNION SELECT '2026_05_07_000003_add_compensatorio_to_turnos'
  UNION SELECT '2026_05_07_000004_add_estado_to_colaboradors_table'
  UNION SELECT '2026_05_07_000005_drop_unused_columns'
) m
WHERE m.migration NOT IN (SELECT `migration` FROM `migrations`);
