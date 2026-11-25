# ansible-macos

My macOS setup, automated with Ansible and chezmoi.

## Usage

On a new Mac:

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/skoric/ansible-macos/main/bootstrap.sh)"
```

This installs Homebrew and Ansible, clones this repo to `~/Development/ansible-macos`, and runs the playbook.

To apply changes afterwards:

```sh
cd ~/Development/ansible-macos && ansible-playbook playbook.yml
```
