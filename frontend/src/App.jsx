import { useState } from 'react'
import Navbar from './components/Navbar'
import UploadPage from './components/UploadPage'
import CropperPage from './components/CropperPage'
import DownloadPage from './components/DownloadPage'
import LandingPage from './components/LandingPage'
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

function App() {
  const [image, setImage] = useState(null);
  const [croppedImages, setCroppedImages] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  
  return (
    <div className='bg-gradient-to-b from-[#F8FAFC] to-bgBlue h-screen'>
      <Router>
            <Navbar /> {/* Navbar akan muncul di semua halaman */}
            <Routes>
                <Route path="/" element={<LandingPage setImage={setImage} setImageFile={setImageFile}/>} />
                <Route path="/crop" element={<CropperPage image={image} imageFile = {imageFile} croppedImages={croppedImages} setCroppedImages={setCroppedImages} />} />
                <Route path="/download" element={<DownloadPage croppedImages={croppedImages} />} />
            </Routes>
        </Router>
    </div>
  )
}

export default App;
