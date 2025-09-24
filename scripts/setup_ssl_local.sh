#!/bin/zsh
# Genera certificados SSL locales con mkcert y los coloca en ./ssl

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SSL_DIR="$ROOT_DIR/ssl"
mkdir -p "$SSL_DIR"

if ! command -v mkcert >/dev/null 2>&1; then
  echo "mkcert no está instalado. Instalando con Homebrew..."
  if ! command -v brew >/dev/null 2>&1; then
    echo "Homebrew no encontrado. Instálalo desde https://brew.sh primero."
    exit 1
  fi
  brew install mkcert nss
fi

mkcert -install
mkcert -key-file "$SSL_DIR/key.pem" -cert-file "$SSL_DIR/cert.pem" localhost 127.0.0.1 ::1

echo "Certificados creados en $SSL_DIR"
exit 0


