import React, { useRef, useEffect, useState } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

const ImageCropper = ({ image, cropperRef, cropWidth, setCropWidth, cropHeight, setCropHeight, aspectRatio }) => {
    const imageRef = useRef(null); // Referensi ke elemen <img>
    const cropBoxDataRef = useRef(null);
    const xyxy = [[0.3711, 0.6739, 0.5358, 0.4166]];
    const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
    
    function convertToPixelCoordinates(boxes, imgWidth, imgHeight) {
        return boxes.map(([x_min, y_min, x_max, y_max]) => {
            return {
                left: (x_min * imgWidth - 0.5 * (x_max * imgWidth)), // Skala ke piksel
                top: (y_min * imgHeight - 0.5 * (y_max * imgHeight)), // Skala ke piksel
                width: x_max * imgWidth,
                height: y_max * imgHeight
            };
        })[0];
    }
    useEffect(() => {
        if (!imageRef.current) return;
    
        const updateSize = () => {
            const { width, height } = imageRef.current.getBoundingClientRect();
            console.log("Updated Size on Resize:", width, height);
            setImgSize({ width, height });
        };
    
        window.addEventListener("resize", updateSize);
        updateSize(); // Panggil pertama kali
    
        return () => window.removeEventListener("resize", updateSize);
    }, [image]); 
    

    // Efek ini jalan setiap kali 'image' berubah
    // useEffect(() => {
    //     if (!imageRef.current) return;
        
    //     const initCropBox = convertToPixelCoordinates(xyxy, imgSize.width, imgSize.height);
    //     // Buat instance Cropper.js di elemen <img>
    //     cropperRef.current = new Cropper(imageRef.current, {
    //         background: false,
    //         dragMode: "crop",
    //         movable: true,
    //         zoomable: false,
    //         rotatable: false,
    //         cropBoxResizable: true,
    //         // ready() {
    //         //     cropperRef.current.setCropBoxData(initCropBox);
    //         // },
    //         crop() {
    //             if (!cropperRef.current) return;
    //             const cropBox = cropperRef.current.getCropBoxData();
    //             setCropWidth(cropBox.width);
    //             setCropHeight(cropBox.height);
    //         },
    //     });

    //     // Cleanup Cropper saat komponen unmount
    //     return () => cropperRef.current?.destroy();
    // }, [image]);

    useEffect(() => {
        if (!imageRef.current || imgSize.width === 0 || imgSize.height === 0) return; 
    
        console.log("Image size updated, initializing Cropper:", imgSize);
    
        const initCropBox = convertToPixelCoordinates(xyxy, imgSize.width, imgSize.height);
    
        cropperRef.current = new Cropper(imageRef.current, {
            viewMode: 1,
            background: false,
            autoCropArea: 1,
            movable: true,
            rotatable: false,
            zoomable: true,
            cropBoxResizable: true,
            cropBoxMovable: true,
            dragMode: "move",
            
            ready() {
                console.log("Setting initial crop box:", initCropBox);
                cropperRef.current.setCropBoxData(initCropBox);
            },
            crop() {
                if (!cropperRef.current) return;
                const cropBox = cropperRef.current.getCropBoxData();
                setCropWidth(cropBox.width);
                setCropHeight(cropBox.height);

                console.log(cropBox)
            },
            
        });
    
        return () => cropperRef.current?.destroy();
    }, [imgSize]); // Sekarang hanya akan jalan setelah imgSize berubah
    

    useEffect(() => {
        if (!cropperRef.current || imgSize.width === 0 || imgSize.height === 0) return;
    
        console.log("imgSize saat setCropBoxData:", imgSize);
    
        const initCropBox = convertToPixelCoordinates(xyxy, imgSize.width, imgSize.height);
        console.log("initCropBox:", initCropBox);
    
        cropperRef.current.setCropBoxData(initCropBox);
        console.log("CropBox:", cropperRef.current.getCropBoxData())
    
    }, [imgSize]); // Hanya dijalankan saat `imgSize` berubah    

    useEffect(() => {
        if (!cropperRef.current) return;
    
        cropperRef.current.setCropBoxData({
            width: cropWidth,
            height: cropHeight,
        });
    }, [cropWidth, cropHeight]);    

    useEffect(() => {
        if (!cropperRef.current) return;
    
        // Simpan posisi crop box sebelum aspect ratio berubah
        cropBoxDataRef.current = cropperRef.current.getCropBoxData();
     
        // Update aspect ratio
        cropperRef.current.setAspectRatio(aspectRatio);
    
        // Setelah aspect ratio berubah, atur posisi crop box kembali
        cropperRef.current.setCropBoxData(cropBoxDataRef.current);
        
    }, [aspectRatio]);

    useEffect(() => {
        if (!cropperRef.current) return;

        setCropHeight(cropperRef.current.getCropBoxData().height);
        setCropWidth(cropperRef.current.getCropBoxData().width);
    }, [cropperRef.current]);

    return (
        <div id = "cropper-image-container" className="text-center mt-5 inline-block relative w-1/2 max-h-[600px]">
            <img 
                ref={imageRef} 
                src={image} 
                alt="To Crop" 
                className="block h-auto w-full bg-white z-0"
            />
        </div>
        

    );
};

export default ImageCropper;
