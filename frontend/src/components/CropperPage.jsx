import React, { useState, useEffect, useRef } from "react";
import ImageCropper from "./ImageCropper";
import CropperSetting from "./CropperSetting";
import { useNavigate } from "react-router-dom";

const CropperPage = ({ image, imageFile, croppedImages, setCroppedImages }) => {
    const [cropWidth, setCropWidth] = useState(800);
    const [cropHeight, setCropHeight] = useState(800);
    const [aspectRatio, setAspectRatio] = useState(null);
    const cropperRef = useRef(null);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("manual-crop");
    const [predictedBoxes, setPredictedBoxes] = useState([]);

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
        <div id = "cropper-main-container" className="flex items-center justify-between h-screen w-screen max-w-6xl mx-auto gap-6">
          {image && <ImageCropper image={image} cropperRef = {cropperRef} cropWidth={cropWidth} setCropWidth={setCropWidth} cropHeight={cropHeight} setCropHeight={setCropHeight} aspectRatio={aspectRatio} activeTab={activeTab} predictedBoxes={predictedBoxes}/>}
          
          <div id = "cropper-setting" className="mt-5 w-1/2 max-h-[600px] flex flex-col items-center">
                <div id = "cropper-choices" className="w-full flex flex-row">
                    <button 
                        id = "manual-crop" 
                        className={`w-1/2 rounded-tl-xl  border-gray-200 border-t-1 border-l-1 px-4 py-2  font-semibold hover:text-textDark transition
                            ${activeTab === "manual-crop" ? " text-textDark border-r-1 bg-white" : " text-gray-400 border-b-1 bg-gray-100"}`}
                        onClick={() => setActiveTab("manual-crop")}
                    >
                        Manual Crop
                    </button>
                    <button 
                        id = "ai-crop" 
                        className={`w-1/2 rounded-tr-xl  border-gray-200 border-t-1 border-r-1 px-4 py-2  font-semibold hover:text-textDark transition
                            ${activeTab === "ai-crop" ? " text-textDark border-l-1 bg-white" : " text-gray-400 border-b-1 bg-gray-100"}`}
                        onClick={() => setActiveTab("ai-crop")}
                    >
                        Use AI
                    </button>
                </div>

                <CropperSetting
                    image = {imageFile}
                    croppedImages={croppedImages}
                    setCroppedImages={setCroppedImages}
                    cropWidth={cropWidth}
                    setCropWidth={setCropWidth}
                    cropHeight={cropHeight}
                    setCropHeight={setCropHeight}
                    setAspectRatio={setAspectRatio}
                    activeTab={activeTab}
                    setPredictedBoxes={setPredictedBoxes}
                />

                <div id = "cropper-button" className="w-full flex flex-col gap-2 mt-5">
                    <button id = "add-crop" onClick={handleAddCrop} className="w-full px-4 py-6 bg-white/60 backdrop-blur-lg text-textDark font-semibold rounded hover:text-accentBlue hover:font-semibold transition border-1 border-gray-300 cursor-pointer shadow-md">
                        Add Crop
                    </button>
                    <button id = "finish-crop" onClick = {processFinishCrop} className="mt-2 w-full px-4 py-6 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition cursor-pointer shadow-md">
                        Finish
                    </button>
                </div>
            </div>
          
        </div>
    );
};

export default CropperPage;