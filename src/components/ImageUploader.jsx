import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";

const ImageUploader = ({ setImage }) => {
    const [fileName, setFileName] = useState("");
    const navigate = useNavigate();
    const [fileLoaded, setFileLoaded] = useState(false);

    // Konfigurasi Dropzone
    const { getRootProps, getInputProps } = useDropzone({
        accept: "image/*",
        multiple: false,
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (!file) return;

            setFileName(file.name); // Simpan nama file
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
                navigate("/crop"); // Beri jeda biar state sempat di-update
            }, 100);
        }
    }, [fileLoaded, navigate]);

    // Gaya CSS untuk drag & drop area
    const dropzoneStyle = "flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-10 cursor-pointer bg-white hover:bg-gray-100 transition";

    return (
        <section id="upload" className="h-screen flex items-center justify-center bg-gradient-to-b from-[#F8FAFC] to-bgBlue flex-col">
            <h1 className="text-7xl font-bold text-textDark mb-5">MultiCropper</h1>
            <h3 className="text-2xl font-normal text-textDark mb-3">Crop many objects just in 1 click!</h3>

            {/* <div {...getRootProps()} className="relative cursor-pointer mt-10">
                <input {...getInputProps()} className="hidden" />

                <button className="bg-blue-500 text-white text-lg font-semibold px-25 py-5 rounded-xl shadow-md hover:bg-blue-600 transition cursor-pointer">
                    Select images
                </button>
            </div>

            <p className="text-gray-500 text-sm mt-2">or drop images here</p> */}
            <div {...getRootProps()} className={`${dropzoneStyle} mt-10`}>
                <input {...getInputProps()} />
                <p className="text-gray-500 text-lg">Drag & drop an image here, or click to select</p>
                {fileName && <p className="mt-2 text-blue-600">{fileName}</p>}
            </div>  
            

            <p className="text-md font-normal text-gray-500 mt-4 italic">Support JPG/JPEG, PNG, and WEBP format.</p>
        </section>
    );
};

export default ImageUploader;
