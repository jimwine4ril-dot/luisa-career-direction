#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_DIR="${ROOT_DIR}/build/hostinger-runtime"
ZIP_PATH="${ROOT_DIR}/build/luisa-career-direction-hostinger.zip"

rm -rf "${BUILD_DIR}"
mkdir -p "${BUILD_DIR}"

rsync -av --delete \
  --include='index.html' \
  --include='styles.css' \
  --include='app.js' \
  --include='.htaccess' \
  --include='api/***' \
  --include='data/' \
  --include='data/.htaccess' \
  --include='data/.gitkeep' \
  --exclude='*' \
  "${ROOT_DIR}/" "${BUILD_DIR}/"

(
  cd "${BUILD_DIR}"
  zip -qr "${ZIP_PATH}" .
)

echo "Runtime package: ${BUILD_DIR}"
echo "Zip package: ${ZIP_PATH}"
