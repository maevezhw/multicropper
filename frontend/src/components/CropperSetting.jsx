import React, { useEffect, useState, useRef } from "react";
import AspectRatioSelector from "./AspectRatioSelector";
import { XMarkIcon, PencilIcon } from "@heroicons/react/24/solid";
import { fetchPrediction } from "../api/cropAI";

const CropperSetting = ({ image, cropperRef, croppedImages, setCroppedImages, cropSize, setCropSize, setAspectRatio, activeTab, setPredictedBoxes, boundingBoxes, setBoundingBoxes, croppedNames, setCroppedNames, setIsProcessing, setError, setSelectedBox}) => {
    const [localSize, setLocalSize] = useState(cropSize);
    const [imageURLs, setImageURLs] = useState([]);
    const [prompt, setPrompt] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedNames, setEditedNames] = useState(croppedNames);
    const [deletedIndex, setDeletedIndex] = useState([]);
    const [renamedIndex, setRenamedIndex] = useState([]);


    // Saat `cropWidth` atau `cropHeight` berubah dari luar, update input
    useEffect(() => {
        setLocalSize({
            width: Math.round(cropSize.width),
            height: Math.round(cropSize.height),
        });
    }, [cropSize]);
    

    // Saat user mengetik angka baru, update global state
    const handleWidthChange = (e) => {
        const newWidth = Number(e.target.value);
        setLocalSize((prev) => ({ ...prev, width: newWidth }));
        setCropSize((prev) => ({ ...prev, width: newWidth }));
    };

    const handleHeightChange = (e) => {
        const newHeight = Number(e.target.value);
        setLocalSize((prev) => ({ ...prev, height: newHeight }));
        setCropSize((prev) => ({ ...prev, height: newHeight }));
    };

    useEffect(() => {
        if (!croppedImages.length) return;
    
        setCroppedNames((prevCroppedNames) => {
            const newNames = croppedImages.map((_, index) => 
                prevCroppedNames[index] || `cropped-${index + 1}`
            );
            return newNames;
        });
    
        const urls = croppedImages.map(blob => URL.createObjectURL(blob));
        setImageURLs(urls);
    
        return () => urls.forEach(url => URL.revokeObjectURL(url));
    }, [croppedImages]);

    const handleClick = (index) => {
        console.log(deletedIndex, deletedIndex.length);
        if (deletedIndex.length > 0) {
            for (let i = deletedIndex.length-1; i >= 0; i--) {
                if (index >= deletedIndex[i]) {
                    index = index + 1;  
                }
            }
        }

        const selectedBox = boundingBoxes[index];
        cropperRef.current.setCropBoxData({
            left: selectedBox.left,
            top: selectedBox.top,
            width: selectedBox.width,
            height: selectedBox.height,
        });
        console.log("Selected Box:", index, boundingBoxes[index]);
    };

    const handleClose = (index) => {
        deletedIndex.push(index);

        const newImages = croppedImages.filter((_, i) => i !== index);
        const newUrls = imageURLs.filter((_, i) => i !== index);
        setCroppedImages(newImages);
        setImageURLs(newUrls);

        // setBoundingBoxes((prevBoxes) => {prevBoxes.filter((_, i) => i !== index)});

        setCroppedNames((prevCroppedNames) => {
            const newNames = croppedImages.map((_, i) => {
                if(renamedIndex.includes(i)) {
                    return prevCroppedNames[i]
                } else {
                    return i <= index ? prevCroppedNames[i] : `cropped-${i}`
                }
            }).filter((_, i) => i !== index); 
        
            return newNames;
        });

        setEditedNames((prevEditedNames) => {
            const newNames = croppedImages.map((_, i) => {
                if(renamedIndex.includes(i)) {
                    return prevEditedNames[i]
                } else {
                    return i <= index ? prevEditedNames[i] : `cropped-${i}`
                }
            }).filter((_, i) => i !== index); 
        
            return newNames;
        });

    };

    const handleRename = (index) => {
        setEditingIndex(index);
    };
    
    const handleNameChange = (index, newName) => {
        const updatedNames = [...editedNames];
        updatedNames[index] = newName;
        setEditedNames(updatedNames);
    };
    
    const handleSave = (index) => {
        setCroppedNames((prevNames) => {
            const updatedNames = [...prevNames]; // Copy state lama

            console.log("Updated Names:", editedNames[index]);
            if (editedNames[index] === undefined) {
                updatedNames[index] = `cropped-${index + 1}`; // Reset ke default jika kosong
            } else {
                updatedNames[index] = editedNames[index];
            } // Hanya update 1 index

            return updatedNames;
        });
        setEditingIndex(null); // Keluar dari mode edit
        renamedIndex.push(index);
    };
    

    // AI Crop

    const handlePromptChange = (e) => setPrompt(e.target.value);

    const handlePromptSubmit = async (event) => {
        event.preventDefault();
    
        if (!prompt || !image) {
          alert("Pastikan gambar dan prompt sudah diisi!");
          return;
        }

        setIsProcessing(true);
    
        try {
          const boxes = await fetchPrediction(image, prompt, setIsProcessing, setError);
          setPredictedBoxes(boxes);
          console.log("Predicted Boxes:", boxes);
        } catch (error) {
          alert("Gagal mendapatkan prediksi: " + error.message);
          setError(true);
        } finally {
          setIsProcessing(false);
        }
       
    };

    useEffect(() => {
        if (!cropperRef.current || activeTab == 'manual-crop') return;

        const newCroppedImages = [];
        console.log("useEffect dipanggil");

        const processCrops = async () => {
    
            for (let i = 0; i < boundingBoxes.length; i++) {
                const box = boundingBoxes[i];
                console.log("Box:", box);
    
                // Update ukuran CropBox
                cropperRef.current.setCropBoxData({
                    left: box.left,
                    top: box.top,
                    width: box.width,
                    height: box.height,
                });
    
                // Tunggu agar CropBox benar-benar terupdate
                await new Promise((resolve) => setTimeout(resolve, 150));
                
                cropperRef.current.crop(); 

                console.log(cropperRef.current.getCropBoxData());
                // Ambil hasil crop
                const croppedCanvas = cropperRef.current.getCroppedCanvas();

                if (!croppedCanvas) continue;
    
                const blob = await new Promise((resolve) => croppedCanvas.toBlob(resolve, "image/png"));
                if (blob) newCroppedImages.push(blob);
            }

            setCroppedImages((prev) => [...prev, ...newCroppedImages]);
        };
    
        processCrops(); 
    
    }, [boundingBoxes]); // Akan jalan ketika cropperRefs di-update
    

    return (
        <div id="cropper-setting-container" className="bg-white border border-t-0 border-gray-200 rounded-b-xl shadow-lg px-8 pb-8 pt-5 max-h-[500px] overflow-y-auto w-full">
            {activeTab === "manual-crop" ? (
                <>
                    <h2 className="text-2xl font-semibold text-accentBlue mb-3">Resize Crop Box</h2>
                    <div id="cropper-setting-size" className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                        <div className="flex flex-row items-center w-full">
                            <label className="text-gray-600 text-lg font-normal mb-1 w-1/3 sm:w-1/4">Width</label>
                            <input
                                placeholder="Width"
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-2/3 sm:w-3/4" 
                                value={localSize.width}
                                onChange={handleWidthChange}
                            />
                        </div>

                        <div className="flex flex-row items-center w-full">
                            <label className="text-gray-600 text-lg font-normal mb-1 w-1/3 sm:w-1/4">Height</label>
                            <input 
                                placeholder="Height"
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-2/3 sm:w-3/4" 
                                value={localSize.height}
                                onChange={handleHeightChange}
                            />
                        </div>
                    </div>

                    <AspectRatioSelector setAspectRatio={setAspectRatio} />
                </>
            ) : (
                <>
                    <h2 className="text-2xl font-semibold text-accentBlue mb-3">Input Prompt</h2>
                    <div id="cropper-setting-size" className="w-full">
                        <form onSubmit={handlePromptSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-3 items-center cursor-pointer">
                            <input
                                type="text"
                                placeholder="e.g. dog, cat, etc. (separated by commas)"
                                value={prompt}
                                onChange={handlePromptChange}
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-3/4" 
                            />
                            <button type="submit" className="mt-3 sm:mt-0 rounded-md bg-accentBlue text-white font-semibold px-3 py-2 w-full sm:w-auto">Submit</button>
                        </form>
                    </div>
                </>
            )}

            {imageURLs.length > 0 && <div id="cropper-show" className="mt-5">
                <h2 className="text-2xl font-semibold text-accentBlue mb-2">Results</h2>
                <div className="flex flex-wrap gap-3">
                    {imageURLs.map((url, index) => (
                        <div className="max-w-[100px] max-h-[100px] relative mb-5">
                            <button
                                onClick={() => handleClose(index)} 
                                className="rounded-full absolute top-0 right-0 w-5 h-5 flex items-center justify-center bg-bgGrey200 hover:bg-bgGrey300 transition"
                            >
                                <XMarkIcon className="w-3 h-3 text-gray-600" />
                            </button>
                            <img 
                                key={index} 
                                src={url} 
                                alt={`Cropped ${index + 1}`} 
                                onClick={() => handleClick(index)}
                                className="flex justify-center items-center max-w-[100px] max-h-[100px] pt-1 pr-2 mx-auto"
                            />
                            <div className="flex items-center mt-1 justify-center text-center max-w-[100px]">
                                {editingIndex === index ? (
                                    <input
                                        type="text"
                                        value={editedNames[index]}
                                        onChange={(e) => handleNameChange(index, e.target.value)}
                                        onBlur={() => handleSave(index)} // Simpan saat kehilangan fokus
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault(); // Mencegah line break
                                                handleSave(index); // Simpan input saat Enter ditekan
                                            }
                                        }}
                                        className="border-b border-gray-400 outline-none w-2/3 bg-transparent text-black text-xs"
                                        autoFocus
                                    />
                                ) : (
                                    <p className="text-black text-xs max-w-2/3 truncate">{croppedNames[index]}</p>
                                )}
                                <button onClick={() => handleRename(index)} className="ml-2">
                                    <PencilIcon className="w-3 h-3 text-gray-500 hover:text-gray-700" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>}
        </div>
    );
};

export default CropperSetting;
