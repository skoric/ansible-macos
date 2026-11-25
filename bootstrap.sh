#!/usr/bin/env bash
#
# Bootstrap a new Mac:
#   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/skoric/ansible-macos/main/bootstrap.sh)"
#
set -euo pipefail

REPO_URL="https://github.com/skoric/ansible-macos.git"
REPO_DIR="$HOME/Development/ansible-macos"

if ! xcode-select -p >/dev/null 2>&1; then
  echo "Xcode Command Line Tools are required for git."
  echo "Run 'xcode-select --install', wait for it to finish, then run this script again."
  exit 1
fi

if [[ -d "$REPO_DIR/.git" ]]; then
  echo "Already cloned: $REPO_DIR"
else
  mkdir -p "$(dirname "$REPO_DIR")"
  git clone "$REPO_URL" "$REPO_DIR"
fi
