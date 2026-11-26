#!/usr/bin/env bash
#
# Bootstrap a new Mac:
#   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/skoric/ansible-macos/main/bootstrap.sh)"
#
# Safe to run again: every step is skipped if it is already done.
#
set -euo pipefail

REPO_URL="https://github.com/skoric/ansible-macos.git"
REPO_SSH_URL="git@github.com:skoric/ansible-macos.git"
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

# Cloned anonymously over HTTPS (a new Mac has no SSH key yet); use SSH from here on
git -C "$REPO_DIR" remote set-url origin "$REPO_SSH_URL"

# Everything else is Ansible's job. The project repositories are private and need
# the SSH key, so they are left for the end.
cd "$REPO_DIR"
ansible-playbook playbook.yml --skip-tags projects

# The steps below need you at the keyboard, so Ansible cannot do them.
# They rely on the playbook having installed op and gh (see group_vars/all.yml).

# 1Password: register this Mac (asks for sign-in address, email, Secret Key, password)
if [[ -z "$(op account list 2>/dev/null)" ]]; then
  op account add
fi

# GitHub CLI: log in through the browser
if ! gh auth status >/dev/null 2>&1; then
  gh auth login --hostname github.com --git-protocol ssh --skip-ssh-key --web
fi

# SSH key: load it from 1Password if the agent has none (asks for the 1Password password)
if ! ssh-add -l >/dev/null 2>&1; then
  zsh -c 'source "$HOME/.zshrc" && ssh-load'
fi

# Private settings: fetch them from 1Password if this Mac does not have them yet
# (asks for the 1Password password)
if [[ ! -f "$REPO_DIR/private.yml" ]]; then
  zsh -c 'source "$HOME/.zshrc" && private-load'
fi

# Project repositories, now that the SSH key and the private list are here
ansible-playbook playbook.yml --tags projects
