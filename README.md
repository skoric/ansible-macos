# ansible-macos

My macOS setup, automated with Ansible and chezmoi.

## Usage

On a new Mac:

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/skoric/ansible-macos/main/bootstrap.sh)"
```

This installs Homebrew and Ansible, clones this repo to `~/Development/ansible-macos`, and runs the playbook.

To apply changes afterwards, from any directory:

```sh
ansible-run
```

## Layout

- `group_vars/all.yml`: what to install.
- `roles/`: how each part is applied.
- `dotfiles/`: dotfiles, managed by chezmoi.
