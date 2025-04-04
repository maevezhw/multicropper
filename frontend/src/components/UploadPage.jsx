import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { replace, useNavigate } from "react-router-dom";

const UploadPage = ({ setImage, setImageFile }) => {
    
    const navigate = useNavigate();
    const [fileLoaded, setFileLoaded] = useState(false);

    const handleNext = () => {
        sessionStorage.setItem("fromUpload", "true"); // Tandai user datang dari CropPage
        navigate("/crop");
    };

    // Konfigurasi Dropzone
    const { getRootProps, getInputProps } = useDropzone({
        accept: {"image/*": [".jpg", ".jpeg", ".png", ".webp"]},
        multiple: false,
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (!file) return;

            setImageFile(file); // Simpan file

            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
                setFileLoaded(true); 
            };
            reader.readAsDataURL(file);
        },
    });

    useEffect(() => {
        if (fileLoaded) {
            setTimeout(() => {
                handleNext(); // Beri jeda biar state sempat di-update
            }, 100);
        }
    }, [fileLoaded, navigate]);

    // Gaya CSS untuk drag & drop area
    const dropzoneStyle = "flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-10 cursor-pointer bg-white hover:bg-gray-100 transition";

    return (
        <section id="upload" className=" upload h-screen flex items-center justify-center bg-gradient-to-b from-[#F8FAFC] to-bgBlue flex-col snap-center">
            <h1 className="text-7xl font-bold mb-5"><span className = "text-textDark" >Multi</span><span className = "text-accentBlue">Cropper</span></h1>
            <h3 className="text-2xl font-normal text-textDark mb-3">Crop multiple areas from a single image with ease.</h3>
            
            <div {...getRootProps()} className={`${dropzoneStyle} mt-5`}>
                <input {...getInputProps()} />
                <p className="text-gray-500 text-lg"><span className="text-accentBlue font-semibold">Drag & drop</span> an image here, or <span className="text-accentBlue font-semibold">click</span> to select</p>
            </div>  
            
            <p className="text-md font-normal text-gray-500 mt-4 italic">Support JPG/JPEG, PNG, and WEBP format.</p>
        </section>
    );
};

export default UploadPage;
