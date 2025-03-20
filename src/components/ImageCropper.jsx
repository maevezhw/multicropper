import React, { useRef, useEffect, useState } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

const ImageCropper = ({ image, cropperRef, cropWidth, setCropWidth, cropHeight, setCropHeight, aspectRatio }) => {
    const imageRef = useRef(null); // Referensi ke elemen <img>
    const cropBoxDataRef = useRef(null);

    // Efek ini jalan setiap kali 'image' berubah
    useEffect(() => {
        if (!imageRef.current) return;

        // Buat instance Cropper.js di elemen <img>
        cropperRef.current = new Cropper(imageRef.current, {
            viewMode: 1,
            background: false,
            dragMode: "crop",
            autoCropArea: 0.4,
            movable: true,
            zoomable: false,
            rotatable: false,
            cropBoxResizable: true,
            crop() {
                if (!cropperRef.current) return;
                const cropBox = cropperRef.current.getCropBoxData();
                setCropWidth(cropBox.width);
                setCropHeight(cropBox.height);
            },
        });

        // Cleanup Cropper saat komponen unmount
        return () => cropperRef.current?.destroy();
    }, [image]);

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
