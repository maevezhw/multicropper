# Gunakan base image Python
FROM python:3.10-slim

# Install libGL buat OpenCV
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    gcc \
    python3-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*


# Set working directory
WORKDIR /app

# Copy semua isi folder ke dalam container
COPY . .

# Install GroundingDINO secara editable (karena kamu sudah clone secara lokal)
RUN pip install -e GroundingDINO

# Install semua dependency dari requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

RUN python -c "import cv2; import supervision; import pycocotools; import torch; import torchvision"

# Jalankan FastAPI dengan Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
