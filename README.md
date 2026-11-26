# ansible-macos

My macOS setup, automated with Ansible and chezmoi.

## Usage

On a new Mac:

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/skoric/ansible-macos/main/bootstrap.sh)"
```

This installs Homebrew and Ansible, clones this repo to `~/Development/ansible-macos`, and runs the playbook. It then asks you to sign in to 1Password and GitHub, and loads the SSH key.

To apply changes afterwards, from any directory:

```sh
ansible-run
```

## Manual steps

Things macOS does not let a script do:

- Desktop widgets: right-click each one and choose Remove Widget.
- AeroSpace: open it once and allow Accessibility access when asked. After that it starts at login.

## Layout

- `group_vars/all.yml`: what to install.
- `roles/`: how each part is applied.
- `dotfiles/`: dotfiles, managed by chezmoi.
- `private.yml`: private settings, such as which repositories to clone and where. Not in git; `private-save` stores it in 1Password and `private-load` fetches it.
