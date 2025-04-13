from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
import os
from PIL import Image
import torch
from torchvision.ops import box_convert
import supervision as sv
from GroundingDINO.groundingdino.util.inference import load_model, load_image, predict
from fastapi.middleware.cors import CORSMiddleware
import psutil
import urllib.request
import transformers
import time

start_time = time.time()
transformers.logging.set_verbosity_error()

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Function cek memory
def print_memory_usage(tag=""):
    process = psutil.Process(os.getpid())
    mem = process.memory_info().rss / 1024 ** 2  # dalam MB
    print(f"[{tag}] Memory usage: {mem:.2f} MB")

# Load model
HOME = os.getcwd()
CONFIG_PATH = os.path.join(HOME, "GroundingDINO/groundingdino/config/GroundingDINO_SwinT_OGC.py")

WEIGHTS_DIR = os.path.join(HOME, "weights")
WEIGHTS_PATH = os.path.join(WEIGHTS_DIR, "groundingdino_swint_ogc.pth")
WEIGHTS_URL = "https://github.com/IDEA-Research/GroundingDINO/releases/download/v0.1.0-alpha/groundingdino_swint_ogc.pth"

os.makedirs(WEIGHTS_DIR, exist_ok=True)

if not os.path.exists(WEIGHTS_PATH):
    print("Downloading weights...")
    urllib.request.urlretrieve(WEIGHTS_URL, WEIGHTS_PATH)
    print("Download complete.")
else:
    print("Weights already downloaded.")


print_memory_usage("Before loading model")
model = load_model(CONFIG_PATH, WEIGHTS_PATH, "cpu")
print_memory_usage("After loading model")

@app.post("/predict/")
async def predict_image(file: UploadFile = File(...), prompt: str = Form(...)):
    try:
        # Simpan gambar sementara
        image_path = f"temp_{file.filename}"
        with open(image_path, "wb") as buffer:
            buffer.write(file.file.read())

        # Load gambar untuk model
        image_source, image = load_image(image_path)
        h, w, _ = image_source.shape  # Ambil tinggi & lebar gambar

        # Prediksi dengan Grounding DINO
        boxes, logits, phrases = predict(
            model=model,
            image=image,
            caption=prompt,
            box_threshold=0.35,
            text_threshold=0.25,
            device="cpu"
        )

        # Format hasil prediksi
        results = [{"box": box.tolist(), "phrase": phrase} for box, phrase in zip(boxes, phrases)]

        # Hapus file gambar setelah digunakan
        os.remove(image_path)

        return JSONResponse(content={"results": results})

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

print(f"Startup complete in {time.time() - start_time:.2f} seconds")