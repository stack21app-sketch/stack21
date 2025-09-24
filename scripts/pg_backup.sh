#!/bin/zsh
# Backup diario de PostgreSQL para Stack21

set -euo pipefail

# Configuración por variables de entorno o defaults locales
DB_HOST=${DB_HOST:-127.0.0.1}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-stack21}
DB_USER=${DB_USER:-stack21}
DB_PASSWORD=${DB_PASSWORD:-stack21_local_pass}

# Directorio de backups relativo al repo
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BACKUP_DIR="$ROOT_DIR/backups"
mkdir -p "$BACKUP_DIR"

# Export para pg_dump
export PGPASSWORD="$DB_PASSWORD"

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
FILENAME="${DB_NAME}_${TIMESTAMP}.sql.gz"
OUTPUT_PATH="$BACKUP_DIR/$FILENAME"

echo "[pg_backup] Iniciando backup a $OUTPUT_PATH"
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
  --clean --create --if-exists --no-owner | gzip > "$OUTPUT_PATH"

echo "[pg_backup] Backup completado: $OUTPUT_PATH"

# Rotación simple: conservar 14 días
find "$BACKUP_DIR" -name "${DB_NAME}_*.sql.gz" -type f -mtime +14 -print -delete || true
echo "[pg_backup] Rotación aplicada (14 días)"

exit 0


