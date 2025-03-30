#!/usr/bin/env bash

# Gunakan Python system-level untuk install pip dulu
/usr/bin/python3 -m ensurepip --default-pip
/usr/bin/python3 -m pip install --upgrade pip setuptools wheel

# Paksa masuk virtual environment
if [ -d "/opt/render/project/src/.venv" ]; then
    source /opt/render/project/src/.venv/bin/activate
fi

# Debugging
python --version
which python
pip --version
which pip

set -eux  # Stop script jika terjadi error

cd backend/app

pip install --upgrade pip
# Install Git LFS
apt-get update && apt-get install -y git-lfs

# Pull LFS files (download weights)
git lfs install
git lfs pull

pip install torch==2.5.1 torchvision==0.20.1
pip install -r requirements.txt

# Jalankan server
uvicorn main:app --host 0.0.0.0 --port 8000
