import React from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ConfirmBeforeUnload from "./ConfirmBeforeUnload";
import LoadingModal from "./LoadingModal";

const DownloadPage = ({ croppedImages, setCroppedImages, croppedNames, setCroppedNames }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fromCrop = sessionStorage.getItem("fromCrop");

        if (!fromCrop) {
            navigate("/", { replace: true });
            return;
        }

        window.history.replaceState(null, "", "/download");

        setTimeout(() => {
            sessionStorage.removeItem("fromCrop");
        }, 500); 

        const handlePopState = () => {
            navigate("/", { replace: true });
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [navigate]);


    const downloadZip = async () => {
        setIsProcessing(true);
        const zip = new JSZip();

        croppedImages.forEach((blob, index) => {
            zip.file(`${croppedNames[index]}.jpeg`, blob);
        });

        const zipBlob = await zip.generateAsync({ type: "blob" });
        saveAs(zipBlob, "cropped_images.zip");
        setIsProcessing(false);
    };

    const handleRestart = () => {
        setCroppedImages([]); 
        setCroppedNames([]); 
        navigate("/");

    }

    return (
        <div id="download-main-container" className="h-screen flex items-center justify-center flex-col w-screen max-w-6xl mx-auto gap-6 px-4 sm:px-8">
            <ConfirmBeforeUnload />
            <h1 className="text-3xl sm:text-4xl font-bold text-textDark mb-5 text-center">Your image has been cropped!</h1>
            
            <button
                id="download-button"
                onClick={downloadZip}
                className="w-full sm:w-1/3 px-4 py-6 bg-accentBlue text-white font-semibold rounded hover:bg-blue-600 transition"
            >
                Download ZIP
            </button>
            
            <button
                id="restart-button"
                onClick={handleRestart}
                className="w-full sm:w-1/3 px-4 py-3 bg-transparent text-gray-500 font-normal rounded hover:text-accentBlue hover:font-semibold transition border border-gray-400"
            >
                Crop another image
            </button>
            
            <LoadingModal isOpen={isProcessing} />
        </div>
        
    )
};

export default DownloadPage;
