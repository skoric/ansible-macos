#!/usr/bin/env bash
#
# Bootstrap a new Mac:
#   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/skoric/ansible-macos/main/bootstrap.sh)"
#
# Safe to run again: every step is skipped if it is already done.
#
set -euo pipefail

REPO_URL="https://github.com/skoric/ansible-macos.git"
REPO_DIR="$HOME/Development/ansible-macos"
BREW="/opt/homebrew/bin/brew"

# Homebrew (its installer also installs the Xcode Command Line Tools, which provide git)
if [[ ! -x "$BREW" ]]; then
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi
eval "$("$BREW" shellenv)"

# Ansible
if ! command -v ansible-playbook >/dev/null 2>&1; then
  brew install ansible
fi

# This repo
if [[ ! -d "$REPO_DIR/.git" ]]; then
  mkdir -p "$(dirname "$REPO_DIR")"
  git clone "$REPO_URL" "$REPO_DIR"
fi

# Everything else is Ansible's job
cd "$REPO_DIR"
ansible-playbook playbook.yml
