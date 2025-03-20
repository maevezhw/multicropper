import React, { useEffect, useState } from "react";
import AspectRatioSelector from "./AspectRatioSelector";
import { XMarkIcon } from "@heroicons/react/24/solid";

const CropperSetting = ({ croppedImages, setCroppedImages, cropWidth, setCropWidth, cropHeight, setCropHeight, aspectRatio, setAspectRatio }) => {
    const [localWidth, setLocalWidth] = useState(cropWidth);
    const [localHeight, setLocalHeight] = useState(cropHeight);
    const [imageURLs, setImageURLs] = useState([]);

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
        return () => urls.forEach(url => URL.revokeObjectURL(url));
    }, [croppedImages]);

    const handleClose = (index) => {
        const newImages = croppedImages.filter((_, i) => i !== index);
        const newUrls = imageURLs.filter((_, i) => i !== index);
        setCroppedImages(newImages);
        setImageURLs(newUrls);
    };

    return (
        <div id="cropper-setting-container" className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 h-[500px] overflow-y-auto w-full">
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

            <div id="cropper-show" className="mt-5">
                <h2 className="text-2xl font-semibold text-accentBlue mb-2">Results</h2>
                <div className="flex flex-wrap gap-2">
                    {imageURLs.map((url, index) => (
                        <div className="w-[110px] h-[110px] relative">
                            <button
                                onClick = {() => handleClose(index)} 
                                className="rounded-full absolute top-0 right-1.5 w-5 h-5 flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition"
                            >
                                <XMarkIcon className="w-3 h-3 text-gray-600" />
                            </button>
                            <img 
                                key={index} 
                                src={url} 
                                alt={`Cropped ${index + 1}`} 
                                className="flex justify-center items-center justify-items-center max-w-[100px] max-h-[100px] pt-1"
                            />
                            
                        </div>
                    ))}
                    
                    
                </div>
            </div>
        </div>
    );
};

export default CropperSetting;
