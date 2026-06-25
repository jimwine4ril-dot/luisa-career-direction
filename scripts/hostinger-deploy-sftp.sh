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
lcd "${BUILD_DIR}"
-mkdir ${HOSTINGER_REMOTE_DIR}
cd ${HOSTINGER_REMOTE_DIR}
-rm .gitignore
-rm README.md
-rm SHARE.md
-rm AGENTS.md
-rm ARCHITECTURE.md
-rm PROJECT_OVERVIEW.md
-rm PROJECT_PRINCIPLES.md
-rm ROADMAP.md
put index.html index.html
put styles.css styles.css
put app.js app.js
put .htaccess .htaccess
-mkdir api
cd api
put api/auth.php auth.php
put api/config.php config.php
put api/dashboard.php dashboard.php
put api/helpers.php helpers.php
put api/state.php state.php
cd ..
-mkdir data
cd data
put data/.htaccess .htaccess
put data/.gitkeep .gitkeep
cd ..
ls
SFTP

echo "Deploying runtime files to ${HOSTINGER_SSH_USER}@${HOSTINGER_SSH_HOST}:${HOSTINGER_REMOTE_DIR}"
echo "Shared data files under data/*.json are not uploaded or deleted."
sftp -P "${HOSTINGER_SSH_PORT}" -b "${BATCH_FILE}" "${HOSTINGER_SSH_USER}@${HOSTINGER_SSH_HOST}"
