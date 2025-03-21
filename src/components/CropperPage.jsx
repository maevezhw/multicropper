import React, { useState, useEffect, useRef } from "react";
import ImageCropper from "./ImageCropper";
import CropperSetting from "./CropperSetting";
import { useNavigate } from "react-router-dom";

const CropperPage = ({ image, croppedImages, setCroppedImages }) => {
    const [cropWidth, setCropWidth] = useState(800);
    const [cropHeight, setCropHeight] = useState(800);
    const [aspectRatio, setAspectRatio] = useState(null);
    const cropperRef = useRef(null);
    const navigate = useNavigate();

    // Fungsi untuk menambahkan hasil crop ke state
    const handleAddCrop = () => {
        if (!cropperRef.current) return;

        const croppedCanvas = cropperRef.current.getCroppedCanvas();
        if (!croppedCanvas) return;

        croppedCanvas.toBlob((blob) => {
            setCroppedImages((prev) => [...prev, blob]); // Simpan hasil crop sebagai Blob
        }, "image/png");
    };

    const processFinishCrop = () => {
        navigate("/download"); // Beri jeda biar state sempat di-update
    }

    return (
        <div id = "cropper-main-container" className="flex items-center justify-between h-screen w-screen max-w-6xl bg-gradient-to-b from-[#F8FAFC] to-bgBlue mx-auto gap-6">
          {image && <ImageCropper image={image} cropperRef = {cropperRef} cropWidth={cropWidth} setCropWidth={setCropWidth} cropHeight={cropHeight} setCropHeight={setCropHeight} aspectRatio={aspectRatio} />}
          
          <div id = "cropper-setting" className="mt-5 w-1/2 max-h-[600px] flex flex-col items-center gap-4">
                <CropperSetting
                    croppedImages={croppedImages}
                    setCroppedImages={setCroppedImages}
                    cropWidth={cropWidth}
                    setCropWidth={setCropWidth}
                    cropHeight={cropHeight}
                    setCropHeight={setCropHeight}
                    aspectRatio={aspectRatio}
                    setAspectRatio={setAspectRatio}
                />

                <div id = "cropper-button" className="w-full flex flex-col gap-2">
                    <button id = "add-crop" onClick={handleAddCrop} className="w-full px-4 py-6 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition">
                        Add Crop
                    </button>
                    <button id = "finish-crop" onClick = {processFinishCrop} className="mt-2 w-full px-4 py-6 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition">
                        Finish
                    </button>
                </div>
            </div>
          
        </div>
    );
};

export default CropperPage;