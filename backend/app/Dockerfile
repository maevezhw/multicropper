FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    gcc \
    python3-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Pre-copy requirements supaya cache lebih efisien
COPY requirements.txt .

# Install main requirements
RUN pip install --no-cache-dir -r requirements.txt

# Copy file penting dulu (biar bisa cache sebagian besar step)
COPY main.py .
COPY weights/ ./weights/

# Copy sisa folder (baru GroundingDINO & lainnya)
COPY GroundingDINO/ ./GroundingDINO/

# Install GroundingDINO (editable mode)
RUN pip install ./GroundingDINO

# Cek semua library
RUN python -c "import cv2; import supervision; import pycocotools; import torch; import torchvision"

EXPOSE 8000

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
