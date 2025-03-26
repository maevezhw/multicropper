import React, { useEffect, useState, useRef } from "react";
import AspectRatioSelector from "./AspectRatioSelector";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { fetchPrediction } from "../api/cropAI";

const CropperSetting = ({ image, cropperRef, croppedImages, setCroppedImages, cropWidth, setCropWidth, cropHeight, setCropHeight, setAspectRatio, activeTab, setPredictedBoxes, boundingBoxes}) => {
    const [localWidth, setLocalWidth] = useState(cropWidth);
    const [localHeight, setLocalHeight] = useState(cropHeight);
    const [imageURLs, setImageURLs] = useState([]);
    const [prompt, setPrompt] = useState("");

    // Saat `cropWidth` atau `cropHeight` berubah dari luar, update input
    useEffect(() => {
        setLocalWidth(Math.round(cropWidth));
        setLocalHeight(Math.round(cropHeight));
    }, [cropWidth, cropHeight]);

    // Saat user mengetik angka baru, update global state
    const handleWidthChange = (e) => {
        const newWidth = Number(e.target.value);
        setLocalWidth(newWidth);
        setCropWidth(newWidth);
    };

    const handleHeightChange = (e) => {
        const newHeight = Number(e.target.value);
        setLocalHeight(newHeight);
        setCropHeight(newHeight);
    };

    useEffect(() => {
        if (!croppedImages.length) return;
        const urls = croppedImages.map(blob => URL.createObjectURL(blob));
        setImageURLs(urls);
        console.log(imageURLs);
        return () => urls.forEach(url => URL.revokeObjectURL(url));
    }, [croppedImages]);

    const handleClose = (index) => {
        const newImages = croppedImages.filter((_, i) => i !== index);
        const newUrls = imageURLs.filter((_, i) => i !== index);
        setCroppedImages(newImages);
        setImageURLs(newUrls);
    };

    // AI Crop

    const handlePromptChange = (e) => setPrompt(e.target.value);

    const handlePromptSubmit = async (event) => {
        event.preventDefault();
    
        if (!prompt || !image) {
          alert("Pastikan gambar dan prompt sudah diisi!");
          return;
        }
    
        try {
          const boxes = await fetchPrediction(image, prompt);
          setPredictedBoxes(boxes);
          console.log("Predicted Boxes:", boxes);
        } catch (error) {
          alert("Gagal mendapatkan prediksi: " + error.message);
        }
       
    };

    useEffect(() => {
        if (!cropperRef.current || activeTab == 'manual-crop') return;

        const newCroppedImages = [];
        console.log("useEffect dipanggil");

        const processCrops = async () => {
    
            for (let i = 0; i < boundingBoxes.length; i++) {
                const box = boundingBoxes[i];
    
                // Update ukuran CropBox
                cropperRef.current.setCropBoxData({
                    left: box.left,
                    top: box.top,
                    width: box.width,
                    height: box.height,
                });
    
                // Tunggu agar CropBox benar-benar terupdate
                await new Promise((resolve) => setTimeout(resolve, 100));
    
                // Ambil hasil crop
                const croppedCanvas = cropperRef.current.getCroppedCanvas();
                if (!croppedCanvas) continue;
    
                croppedCanvas.toBlob((blob) => {
                    newCroppedImages.push(blob);
    
                    // Jika sudah semua, update state
                    if (newCroppedImages.length === boundingBoxes.length) {
                        setCroppedImages((prev) => [...prev, ...newCroppedImages]);
                    }
                }, "image/png");

                console.log("Last Cropped Images:", newCroppedImages);
            }
        };
    
        processCrops(); 
    
    }, [boundingBoxes]); // Akan jalan ketika cropperRefs di-update
    

    return (
        <div id="cropper-setting-container" className="bg-white border border-t-0 border-gray-200 rounded-b-xl shadow-lg px-8 pb-8 pt-5 max-h-[500px] overflow-y-auto w-full">
            { activeTab === "manual-crop" ? (
                <>
                    <h2 className="text-2xl font-semibold text-accentBlue mb-3">Resize Crop Box</h2>
                    <div id="cropper-setting-size" className="grid grid-cols-2 gap-4 w-full">
                        <div className="flex flex-row justify-between items-center">
                            <label className="text-gray-600 text-lg font-normal mb-1 w-1/4">Width</label>
                            <input
                                placeholder="Width"
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-3/4" 
                                value={localWidth}
                                onChange={handleWidthChange}
                            />
                        </div>

                        <div className="flex flex-row justify-between items-center">
                            <label className="text-gray-600 text-lg font-normal mb-1 w-1/4">Height</label>
                            <input 
                                placeholder="Height"
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-3/4" 
                                value={localHeight}
                                onChange={handleHeightChange}
                            />
                        </div>
                    </div>

                    <AspectRatioSelector setAspectRatio={setAspectRatio} />

                    {imageURLs.length > 0 && <div id="cropper-show" className="mt-5">
                        <h2 className="text-2xl font-semibold text-accentBlue mb-2">Results</h2>
                        <div className="flex flex-wrap gap-2">
                            {imageURLs.map((url, index) => (
                                <div className="max-w-[110px] max-h-[110px] relative">
                                    <button
                                        onClick = {() => handleClose(index)} 
                                        className="rounded-full absolute top-0 right-0 w-5 h-5 flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition"
                                    >
                                        <XMarkIcon className="w-3 h-3 text-gray-600" />
                                    </button>
                                    <img 
                                        key={index} 
                                        src={url} 
                                        alt={`Cropped ${index + 1}`} 
                                        className="flex justify-center items-center justify-items-center max-w-[100px] max-h-[100px] pt-1 pr-2"
                                    />
                                    
                                </div>
                            ))}
                            
                        </div>
                    </div>} 
                </> ) : (
                <>
                    <h2 className="text-2xl font-semibold text-accentBlue mb-3">Input Prompt</h2>
                    <div id="cropper-setting-size" className="w-full">
                        <form onSubmit={handlePromptSubmit} className="flex flex-row justify-between gap-3 items-center cursor-pointer">
                            <input
                                type = "text"
                                placeholder="Enter prompt"
                                value = {prompt}
                                onChange = {handlePromptChange}
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" 
                            />
                            <button type="submit" className="rounded-md bg-accentBlue text-white font-semibold px-3 py-2">Submit</button>
                        </form>
                    </div>

                    {imageURLs.length > 0 && <div id="cropper-show" className="mt-5">
                        <h2 className="text-2xl font-semibold text-accentBlue mb-2">Results</h2>
                        <div className="flex flex-wrap gap-2">
                            {imageURLs.map((url, index) => (
                                <div className="max-w-[110px] max-h-[110px] relative">
                                    <button
                                        onClick = {() => handleClose(index)} 
                                        className="rounded-full absolute top-0 right-0 w-5 h-5 flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition"
                                    >
                                        <XMarkIcon className="w-3 h-3 text-gray-600" />
                                    </button>
                                    <img 
                                        key={index} 
                                        src={url} 
                                        alt={`Cropped ${index + 1}`} 
                                        className="flex justify-center items-center justify-items-center max-w-[100px] max-h-[100px] pt-1 pr-2"
                                    />
                                    
                                </div>
                            ))}
                            
                        </div>
                    </div>} 
                </>
                ) 
            }
        </div>
    );
};

export default CropperSetting;
