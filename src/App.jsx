import { useState } from 'react'
import Navbar from './components/Navbar'
import ImageUploader from './components/ImageUploader'
import ImageCropper from './components/ImageCropper'
import CropperPage from './components/CropperPage'
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

function App() {
  const [image, setImage] = useState(null);
  const [croppedImages, setCroppedImages] = useState([]);
  
  return (
    <div className='bg-gradient-to-b from-[#F8FAFC] to-bgBlue h-screen'>
      <Router>
            <Navbar /> {/* Navbar akan muncul di semua halaman */}
            <Routes>
                <Route path="/" element={<ImageUploader setImage={setImage} />} />
                <Route path="/crop" element={<CropperPage image={image} croppedImages={croppedImages} setCroppedImages={setCroppedImages} />} />
            </Routes>
        </Router>
    </div>
  )
}

export default App;
