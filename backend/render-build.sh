#!/usr/bin/env bash

set -eux  # Stop script jika terjadi error

# Install Git LFS
apt-get update && apt-get install -y git-lfs

# Pull LFS files (download weights)
git lfs install
git lfs pull

git submodule update --init --recursive

# Jalankan server
uvicorn main:app --host 0.0.0.0 --port 8000
