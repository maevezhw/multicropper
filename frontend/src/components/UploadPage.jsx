import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";

const UploadPage = ({ setImage, setImageFile }) => {
    
    const navigate = useNavigate();
    const [fileLoaded, setFileLoaded] = useState(false);

    const handleNext = () => {
        sessionStorage.setItem("fromUpload", "true");
        navigate("/crop");
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: {"image/*": [".jpg", ".jpeg", ".png", ".webp"]},
        multiple: false,
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (!file) return;

            setImageFile(file); 

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
                handleNext(); 
            }, 100);
        }
    }, [fileLoaded, navigate]);

    const dropzoneStyle = "flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-6 sm:p-10 cursor-pointer bg-white hover:bg-gray-100 transition w-full max-w-xl";

    return (
        <section
            id="upload"
            className="upload min-h-screen flex items-center justify-center bg-gradient-to-b from-bgBlue to-bgWhite flex-col snap-center px-4 text-center"
        >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4">
                <span className="text-textDark">Multi</span>
                <span className="text-accentBlue">Cropper</span>
            </h1>
            <h3 className="text-lg sm:text-xl md:text-2xl font-normal text-textDark mb-4">
                Crop multiple areas from a single image with ease.
            </h3>

            <div {...getRootProps()} className={`${dropzoneStyle} mt-5`}>
                <input {...getInputProps()} />
                <p className="text-gray-500 text-base sm:text-lg text-center">
                    <span className="text-accentBlue font-semibold">Drag & drop</span> an image here, or <span className="text-accentBlue font-semibold">click</span> to select
                </p>
            </div>

            <p className="text-sm sm:text-md font-normal text-gray-500 mt-4 italic">
                Supports JPG, JPEG, PNG, and WEBP format.
            </p>
        </section>
    );

};

export default UploadPage;
