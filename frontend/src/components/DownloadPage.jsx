import React from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";

const DownloadButton = ({ croppedImages }) => {
    if (!croppedImages.length) return null; // Kalau tidak ada hasil crop, tombol tidak muncul

    const navigate = useNavigate();

    // Fungsi untuk mengunduh ZIP
    const downloadZip = async () => {
        const zip = new JSZip();

        // Tambahkan setiap hasil crop ke dalam ZIP
        croppedImages.forEach((blob, index) => {
            zip.file(`cropped_${index + 1}.png`, blob);
        });

        // Generate ZIP dan unduh
        const zipBlob = await zip.generateAsync({ type: "blob" });
        saveAs(zipBlob, "cropped_images.zip");
    };

    const handleRestart = () => {
        navigate("/"); // Kembali ke halaman upload
    }

    return (
        <div id = "download-main-container" className="h-screen flex items-center justify-center flex-col w-screen max-w-6xl mx-auto gap-6">
            <h1 className="text-4xl font-bold text-textDark mb-5">Your image has been cropped!</h1>
            <button id = "download-button" onClick={downloadZip} className="w-1/3 px-4 py-6 bg-accentBlue text-white font-semibold rounded hover:bg-blue-600 transition"> 
                Download ZIP 
            </button>
            <button id = "restart-button" onClick={handleRestart} className="w-1/3 px-4 py-3 bg-transparent text-gray-500 font-normal rounded hover:text-accentBlue hover:font-semibold transition border-1 border-gray-400">
                Crop another image
            </button>

        </div>
        
    )
};

export default DownloadButton;
