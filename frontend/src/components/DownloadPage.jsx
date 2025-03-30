import React from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ConfirmBeforeUnload from "./ConfirmBeforeUnload";
import LoadingModal from "./LoadingModal";

const DownloadPage = ({ croppedImages, croppedNames }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fromCrop = sessionStorage.getItem("fromCrop");

        // Kalau akses langsung tanpa dari Crop, redirect ke UploadPage
        if (!fromCrop) {
            navigate("/", { replace: true });
            return;
        }

        // Ganti history agar tombol Back tidak kembali ke CropPage
        window.history.replaceState(null, "", "/download");

        // Hapus tanda "fromCrop" setelah beberapa saat agar tidak langsung ke "/"
        setTimeout(() => {
            sessionStorage.removeItem("fromCrop");
        }, 500); // Delay 500ms agar tidak langsung balik

        // Saat user klik tombol Back, langsung ke UploadPage
        const handlePopState = () => {
            navigate("/", { replace: true });
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [navigate]);


    // Fungsi untuk mengunduh ZIP
    const downloadZip = async () => {
        setIsProcessing(true);
        const zip = new JSZip();

        // Tambahkan setiap hasil crop ke dalam ZIP
        croppedImages.forEach((blob, index) => {
            zip.file(`${croppedNames[index]}.jpeg`, blob);
        });

        // Generate ZIP dan unduh
        const zipBlob = await zip.generateAsync({ type: "blob" });
        saveAs(zipBlob, "cropped_images.zip");
        setIsProcessing(false);
    };

    const handleRestart = () => {
        navigate("/"); // Kembali ke halaman upload
    }

    return (
        <div id = "download-main-container" className="h-screen flex items-center justify-center flex-col w-screen max-w-6xl mx-auto gap-6">
            <ConfirmBeforeUnload />
            <h1 className="text-4xl font-bold text-textDark mb-5">Your image has been cropped!</h1>
            <button id = "download-button" onClick={downloadZip} className="w-1/3 px-4 py-6 bg-accentBlue text-white font-semibold rounded hover:bg-blue-600 transition"> 
                Download ZIP 
            </button>
            <button id = "restart-button" onClick={handleRestart} className="w-1/3 px-4 py-3 bg-transparent text-gray-500 font-normal rounded hover:text-accentBlue hover:font-semibold transition border-1 border-gray-400">
                Crop another image
            </button>
            <LoadingModal isOpen={isProcessing} />

        </div>
        
    )
};

export default DownloadPage;
