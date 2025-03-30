import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from './components/Navbar';
import UploadPage from './components/UploadPage';
import CropperPage from './components/CropperPage';
import DownloadPage from './components/DownloadPage';
import LandingPage from './components/LandingPage';

function App() {
  const [image, setImage] = useState(null);
  const [croppedImages, setCroppedImages] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [croppedNames, setCroppedNames] = useState([]);

  return (
    <Router>
      <AppContent 
        image={image} setImage={setImage} 
        imageFile={imageFile} setImageFile={setImageFile} 
        croppedImages={croppedImages} setCroppedImages={setCroppedImages} 
        croppedNames={croppedNames} setCroppedNames={setCroppedNames} 
      />
    </Router>
  );
}

function AppContent({ image, setImage, imageFile, setImageFile, croppedImages, setCroppedImages, croppedNames, setCroppedNames }) {
  const location = useLocation(); // Pastikan dipakai di dalam Router
  return (
    <div className='bg-gradient-to-b from-[#F8FAFC] to-bgBlue h-screen'>
      {location.pathname !== '/' && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage setImage={setImage} setImageFile={setImageFile}/>} />
        <Route path="/crop" element={<CropperPage image={image} imageFile={imageFile} croppedImages={croppedImages} setCroppedImages={setCroppedImages} croppedNames={croppedNames} setCroppedNames={setCroppedNames}/>} />
        <Route path="/download" element={<DownloadPage croppedImages={croppedImages} croppedNames={croppedNames}/>} />
      </Routes>
    </div>
  );
}

export default App;
