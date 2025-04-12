import React, { useState, useEffect, useRef } from "react";
import ImageCropper from "./ImageCropper";
import CropperSetting from "./CropperSetting";
import { useNavigate } from "react-router-dom";
import ConfirmBeforeUnload from "./ConfirmBeforeUnload";
import LoadingModal from "./LoadingModal";
import ErrorModal from "./ErrorModal";

const CropperPage = ({ image, imageFile, croppedImages, setCroppedImages, croppedNames, setCroppedNames }) => {
    const [cropSize, setCropSize] = useState({width: 800, height: 800});
    const [aspectRatio, setAspectRatio] = useState(null);
    const cropperRef = useRef(null);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("manual-crop");
    const [predictedBoxes, setPredictedBoxes] = useState([]);
    const [boundingBoxes, setBoundingBoxes] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(false);
    const [selectedBox, setSelectedBox] = useState(null);

    useEffect(() => {
        setCroppedImages([]);
        setCroppedNames([]);
    }, []); // Dependency array kosong agar hanya jalan sekali    

    useEffect(() => {
        const fromUpload = sessionStorage.getItem("fromUpload");

        if (!fromUpload) {
            navigate("/", { replace: true }); // Redirect ke UploadPage kalau akses langsung
        }

    }, [navigate]);

    useEffect(() => {
        if (!image) {
            navigate("/", { replace: true }); // Redirect ke UploadPage kalau tidak ada gambar
        }
    }, [image]);
    
    // Fungsi untuk menambahkan hasil crop ke state
    const handleAddCrop = () => {
        if (!cropperRef.current) return;

        const croppedCanvas = cropperRef.current.getCroppedCanvas();
        if (!croppedCanvas) return;

        croppedCanvas.toBlob((blob) => {
            setCroppedImages((prev) => [...prev, blob]); // Simpan hasil crop sebagai Blob
        }, "image/jpeg");
    };

    const processFinishCrop = () => {
        if (croppedImages.length === 0) {
            setError(true);
            return;
        }
        setTimeout(() => {
            sessionStorage.setItem("fromCrop", "true"); // Tandai user datang dari CropPage
            navigate("/download");
        }, 100);

        sessionStorage.removeItem("fromUpload");
    }

    return (
        <div
          id="cropper-main-container"
          className="flex flex-col-reverse md:flex-row items-center justify-between min-h-screen w-full max-w-6xl mx-auto gap-6 px-4 py-6"
        >
          <ConfirmBeforeUnload />
      
          {/* Setting Panel */}
          <div
            id="cropper-setting"
            className="w-full md:w-1/2 max-h-[600px] flex flex-col items-center"
          >
            <div id="cropper-choices" className="w-full flex">
              <button
                id="manual-crop"
                className={`w-1/2 rounded-tl-xl border-gray-200 border-t border-l px-4 py-2 font-semibold hover:text-textDark transition ${
                  activeTab === "manual-crop"
                    ? "text-textDark border-r bg-white"
                    : "text-gray-400 border-b bg-gray-100"
                }`}
                onClick={() => setActiveTab("manual-crop")}
              >
                Manual Crop
              </button>
              <button
                id="ai-crop"
                className={`w-1/2 rounded-tr-xl border-gray-200 border-t border-r px-4 py-2 font-semibold hover:text-textDark transition ${
                  activeTab === "ai-crop"
                    ? "text-textDark border-l bg-white"
                    : "text-gray-400 border-b bg-gray-100"
                }`}
                onClick={() => setActiveTab("ai-crop")}
              >
                Use AI
              </button>
            </div>
      
            <CropperSetting
              image={imageFile}
              cropperRef={cropperRef}
              croppedImages={croppedImages}
              setCroppedImages={setCroppedImages}
              cropSize={cropSize}
              setCropSize={setCropSize}
              setAspectRatio={setAspectRatio}
              activeTab={activeTab}
              setPredictedBoxes={setPredictedBoxes}
              boundingBoxes={boundingBoxes}
              setBoundingBoxes={setBoundingBoxes}
              croppedNames={croppedNames}
              setCroppedNames={setCroppedNames}
              setIsProcessing={setIsProcessing}
              setError={setError}
              setSelectedBox={setSelectedBox}
            />
      
            {/* Buttons */}
            <div id="cropper-button" className="w-full flex flex-col gap-2 mt-5">
              {activeTab === "manual-crop" && (
                <button
                  id="add-crop"
                  onClick={handleAddCrop}
                  className="w-full px-4 py-4 bg-white/60 backdrop-blur-lg text-textDark font-semibold rounded hover:text-accentBlue transition border border-gray-300 cursor-pointer shadow-md"
                >
                  Add Crop
                </button>
              )}
              <button
                id="finish-crop"
                onClick={processFinishCrop}
                className="w-full px-4 py-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition cursor-pointer shadow-md"
              >
                Finish
              </button>
            </div>
          </div>
      
          {/* Cropper */}
          {image && (
            <div className="w-full md:w-1/2 flex items-center justify-center">
              <ImageCropper
                image={image}
                cropperRef={cropperRef}
                cropSize={cropSize}
                setCropSize={setCropSize}
                aspectRatio={aspectRatio}
                activeTab={activeTab}
                predictedBoxes={predictedBoxes}
                setBoundingBoxes={setBoundingBoxes}
                selectedBox={selectedBox}
                setSelectedBox={setSelectedBox}
              />
            </div>
          )}
      
          {/* Modals */}
          {isProcessing && <LoadingModal isOpen={isProcessing} />}
          {error && (
            <ErrorModal
              isOpen={error}
              message="You haven't cropped any part of the image yet. Please crop before downloading."
              onClose={() => setError(false)}
            />
          )}
        </div>
      );      
};

export default CropperPage;