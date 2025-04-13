import React, { useRef, useEffect, useState } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

const ImageCropper = ({ image, cropperRef, cropSize, setCropSize, aspectRatio, activeTab, predictedBoxes, setBoundingBoxes, selectedBox, setSelectedBox }) => {
    const imageRef = useRef(null); // Referensi ke elemen <img>
    const cropBoxDataRef = useRef(null);
    const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
    const [translate, setTranslate] = useState({ x: 0, y: 0 });

    // Fungsi untuk mendeteksi klik di dalam bounding box
    const handleClick = (index) => {
        setSelectedBox(boundingBoxes[index]); // Set bounding box yang dipilih
        console.log("Selected Box:", boundingBoxes[index]);
    };

    function convertToPixelCoordinates(boxes, imgWidth, imgHeight) {
        if (!boxes) return [];

        return boxes.map(item => {
            return {
                left: (item.box[0]* imgWidth - 0.5 * (item.box[2] * imgWidth)), // Skala ke piksel
                top: (item.box[1] * imgHeight - 0.5 * (item.box[3] * imgHeight)), // Skala ke piksel
                width: item.box[2] * imgWidth,
                height: item.box[3] * imgHeight
            };
        });
    }

    const boundingBoxes = convertToPixelCoordinates(
        predictedBoxes,
        imgSize.width,
        imgSize.height
    );

    function isBoxCompletelyCovered(box, otherBox) {
        return (
            otherBox.left >= box.left &&
            otherBox.top >= box.top &&
            otherBox.left + otherBox.width <= box.left + box.width &&
            otherBox.top + otherBox.height <= box.top + box.height
        );
    }    

    // Efek ini jalan setiap kali 'image' berubah atau 'activeTab' berubah
    useEffect(() => {
        if (!imageRef.current) return;

        if (cropperRef.current) {
            cropperRef.current.destroy();
        }

        cropperRef.current = new Cropper(imageRef.current, {
            viewMode: 1,
            background: false,
            autoCropArea: 0.4,
            movable: false,
            rotatable: false,
            zoomable: false,
            cropBoxResizable: true,
            cropBoxMovable: true,
            dragMode: "crop",
            multiple: true,
            crop() {
                if (!cropperRef.current) return;
                const {width, height} = cropperRef.current.getCropBoxData();
                setCropSize(prev => {
                    if (prev.width === width && prev.height === height) {
                        return prev; // Tidak update state jika ukuran sama
                    }
                    return { width, height };
                });
            },

            ready() {
                const { width, height } = cropperRef.current.getCanvasData();
                setImgSize({ width, height });

                const canvasEl = document.querySelector('.cropper-canvas');

                if (canvasEl) {
                    const transformValue = getComputedStyle(canvasEl).transform;
                    
                    // Ubah dari matrix() ke translateX
                    const matrixValues = transformValue.match(/matrix\(([^)]+)\)/);
                    if (matrixValues) {
                        const values = matrixValues[1].split(', ');
                        const translateX = parseFloat(values[4]);
                        const translateY = parseFloat(values[5]);

                        setTranslate({ x: translateX, y: translateY });
                    }
                }

                cropperRef.current.setCropBoxData(boundingBoxes[0]);

                console.log("Canvas Width:", width, "Canvas Height:", height);
                console.log("Translate X:", translate.x, "Translate Y:", translate.y);
            }

        });
    
        return () => {
            cropperRef.current?.destroy();
        };
    }, [image]);

    useEffect(() => {
        if (!cropperRef.current) return;
    
        const adjustedBoxes = boundingBoxes.map((box) => ({
            left: box.left + translate.x,
            top: box.top + translate.y,
            width: box.width,
            height: box.height,
        }));
        console.log("Adjusted Boxes:", adjustedBoxes);
        setBoundingBoxes(adjustedBoxes); // Update state dengan bounding box yang sudah dikoreksi
    
    }, [translate, predictedBoxes]); 


    // Update ukuran crop box jika nilai cropWidth / cropHeight berubah
    useEffect(() => {
        if (!cropperRef.current) return;

        cropperRef.current.setCropBoxData({
            width: cropSize.width,
            height: cropSize.height,
        });
    }, [cropSize]);

    // Update aspect ratio ketika berubah
    useEffect(() => {
        if (!cropperRef.current) return;

        cropBoxDataRef.current = cropperRef.current.getCropBoxData();
        cropperRef.current.setAspectRatio(aspectRatio);
        cropperRef.current.setCropBoxData(cropBoxDataRef.current);
    }, [aspectRatio]);

    useEffect(() => {
        if (!cropperRef.current || !selectedBox) return;

        cropperRef.current.setCropBoxData({
            left: (selectedBox.left + translate.x),
            top: (selectedBox.top + translate.y),
            width: selectedBox.width,
            height: selectedBox.height,
        });

        console.log("Translate: ", translate.x, translate.y);
    }, [selectedBox]);

    return (
        <div id="cropper-image-container" className="text-center mt-5 block max-w-full max-h-[600px] mx-auto relative">
            <img 
                ref={imageRef} 
                src={image} 
                alt="To Crop" 
                className="block w-full h-auto bg-white z-0"
            />
    
            {activeTab === "ai-crop" && imgSize.width > 0 && imgSize.height > 0 && 
                <div className="absolute top-0 left-1/2 mx-auto pointer-events-none" 
                    style={{
                        width: imgSize.width, 
                        height: imgSize.height, 
                        transform: "translateX(-50%)"
                    }}
                >
                    {boundingBoxes.map((box, index) => {
                        const isCovered = boundingBoxes.some((otherBox, otherIndex) => 
                            otherIndex !== index && isBoxCompletelyCovered(box, otherBox)
                        );
    
                        return (
                            <div
                                key={index}
                                onClick={() => handleClick(index)}
                                className="absolute border-2 border-red-500 cursor-pointer"
                                style={{
                                    left: `${box.left}px`,
                                    top: `${box.top}px`,
                                    width: `${box.width}px`,
                                    height: `${box.height}px`,
                                    zIndex: isCovered ? 5 : 10,
                                    pointerEvents: "auto" // Jika tertutup, klik bisa ke box bawah
                                }}
                            />
                        );
                    })}
                </div>
            }
        </div>
    );
    
};

export default ImageCropper;
