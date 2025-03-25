from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
import os
from PIL import Image
import torch
from torchvision.ops import box_convert
import supervision as sv
from GroundingDINO.groundingdino.util.inference import load_model, load_image, predict

app = FastAPI()

# Load model
HOME = os.getcwd()
CONFIG_PATH = os.path.join(HOME, "GroundingDINO/groundingdino/config/GroundingDINO_SwinT_OGC.py")
WEIGHTS_PATH = os.path.join(HOME, "weights", "groundingdino_swint_ogc.pth")
model = load_model(CONFIG_PATH, WEIGHTS_PATH)

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
            text_threshold=0.25
        )

        # Konversi boxes ke format xywh
        boxes_scaled = boxes * torch.Tensor([w, h, w, h])  # Sesuaikan dengan ukuran gambar
        xywh_boxes = box_convert(boxes=boxes_scaled, in_fmt="cxcywh", out_fmt="xywh").numpy()

        # Format hasil prediksi
        results = [{"box": box.tolist(), "phrase": phrase} for box, phrase in zip(xywh_boxes, phrases)]

        # Hapus file gambar setelah digunakan
        os.remove(image_path)

        return JSONResponse(content={"results": results})

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
