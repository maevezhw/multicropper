import { useState } from 'react'
import Navbar from './components/Navbar'
import UploadPage from './components/UploadPage'
import CropperPage from './components/CropperPage'
import DownloadPage from './components/DownloadPage'
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

function App() {
  const [image, setImage] = useState(null);
  const [croppedImages, setCroppedImages] = useState([]);
  
  return (
    <div className='bg-gradient-to-b to-bgBlue h-screen'>
      <Router>
            <Navbar /> {/* Navbar akan muncul di semua halaman */}
            <Routes>
                <Route path="/" element={<UploadPage setImage={setImage} />} />
                <Route path="/crop" element={<CropperPage image={image} croppedImages={croppedImages} setCroppedImages={setCroppedImages} />} />
                <Route path="/download" element={<DownloadPage croppedImages={croppedImages} />} />
            </Routes>
        </Router>
    </div>
  )
}

export default App;
