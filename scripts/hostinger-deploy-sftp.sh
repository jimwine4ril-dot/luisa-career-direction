#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.hostinger.env"
BUILD_DIR="${ROOT_DIR}/build/hostinger-runtime"

if [[ -f "${ENV_FILE}" ]]; then
  # shellcheck disable=SC1090
  source "${ENV_FILE}"
fi

: "${HOSTINGER_SSH_HOST:?Set HOSTINGER_SSH_HOST in .hostinger.env}"
: "${HOSTINGER_SSH_USER:?Set HOSTINGER_SSH_USER in .hostinger.env}"
: "${HOSTINGER_REMOTE_DIR:?Set HOSTINGER_REMOTE_DIR in .hostinger.env}"
HOSTINGER_SSH_PORT="${HOSTINGER_SSH_PORT:-22}"

"${ROOT_DIR}/scripts/hostinger-package.sh" >/dev/null

BATCH_FILE="$(mktemp)"
trap 'rm -f "${BATCH_FILE}"' EXIT

cat > "${BATCH_FILE}" <<SFTP
mkdir ${HOSTINGER_REMOTE_DIR}
cd ${HOSTINGER_REMOTE_DIR}
rm README.md
rm SHARE.md
rm AGENTS.md
rm ARCHITECTURE.md
rm PROJECT_OVERVIEW.md
rm PROJECT_PRINCIPLES.md
rm ROADMAP.md
put ${BUILD_DIR}/index.html index.html
put ${BUILD_DIR}/styles.css styles.css
put ${BUILD_DIR}/app.js app.js
put ${BUILD_DIR}/.htaccess .htaccess
mkdir api
cd api
put ${BUILD_DIR}/api/auth.php auth.php
put ${BUILD_DIR}/api/config.php config.php
put ${BUILD_DIR}/api/dashboard.php dashboard.php
put ${BUILD_DIR}/api/helpers.php helpers.php
put ${BUILD_DIR}/api/state.php state.php
cd ..
mkdir data
cd data
put ${BUILD_DIR}/data/.htaccess .htaccess
put ${BUILD_DIR}/data/.gitkeep .gitkeep
cd ..
ls
SFTP

echo "Deploying runtime files to ${HOSTINGER_SSH_USER}@${HOSTINGER_SSH_HOST}:${HOSTINGER_REMOTE_DIR}"
echo "Shared data files under data/*.json are not uploaded or deleted."
sftp -P "${HOSTINGER_SSH_PORT}" -b "${BATCH_FILE}" "${HOSTINGER_SSH_USER}@${HOSTINGER_SSH_HOST}"
