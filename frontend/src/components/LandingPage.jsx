import { useState, useEffect, use } from "react";
// import { Button } from "@/components/ui/button";
import { FaUpload, FaCropAlt, FaDownload, FaMagic } from "react-icons/fa";
import UploadPage from "./UploadPage";
import ScrollReveal from "scrollreveal";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const LandingPage = ({ setImage, setImageFile }) => {
    const navigate = useNavigate();

    useEffect(() => {
        ScrollReveal().reveal(".reveal", {
          origin: "bottom",
          distance: "50px",
          duration: 1000,
          delay: 200,
          easing: "ease-in-out",
          reset: true, 
        });
      }, []);

      const handleCTA = () => {
        navigate("/upload"); // Beri jeda biar state sempat di-update
    }

    return (
        <div className="bg-blue-50 text-gray-900 min-h-screen">
            <UploadPage setImage={setImage} setImageFile={setImageFile} />
    
            {/* Features Section */}
            <section
                id="features"
                className="features flex flex-col items-center justify-center text-center snap-center bg-gradient-to-b from-bgBlue to-bgWhite w-full pb-[10vh] px-4"
            >
                <div className="max-w-6xl w-full mx-auto reveal">
                    <h2 className="features-title text-3xl sm:text-4xl md:text-5xl font-semibold text-accentBlue">
                        Features
                    </h2>
                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                        <FeatureCard icon={<FaCropAlt />} title="Multiple Crops" description="Select multiple areas from a single image effortlessly." />
                        <FeatureCard icon={<FaMagic />} title="AI Detection" description="Utilize AI to detect and crop objects based on your prompt." />
                        <FeatureCard icon={<FaDownload />} title="Customizable Cropping" description="Modify crop boxes by adjusting width, height, aspect ratio, and position." />
                    </div>
                </div>
            </section>
    
            {/* How It Works */}
            <section
                id="how-it-works"
                className="how-it-works snap-center w-full min-h-screen bg-bgWhite flex items-center justify-center px-4 py-12"
            >
                <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-[60%_40%] gap-10 items-center">
                    <div className="rounded-2xl bg-accentBlue py-10 px-6 sm:px-10 reveal">
                        <h2 className="text-3xl sm:text-4xl font-semibold text-white text-center md:text-left">How It Works</h2>
                        <ol className="mt-8 text-base sm:text-lg text-left space-y-4 text-white">
                            <li><strong>1. Upload an Image:</strong> Supports JPG, JPEG, PNG, and WEBP formats.</li>
                            <li><strong>2. Choose Cropping Method:</strong> Manual cropping or AI-powered detection.</li>
                            <li><strong>3. AI Cropping:</strong> Enter a prompt, and AI will detect and crop the object you specify.</li>
                            <li><strong>4. Manual Cropping:</strong> Adjust or create new crop boxes manually.</li>
                            <li><strong>5. Finalize Cropping:</strong> Click "Finish" when done.</li>
                            <li><strong>6. Download:</strong> Get your cropped images in a ZIP file.</li>
                        </ol>
                    </div>
                    <div className="flex justify-center items-center w-full h-full">
                        <img src="/how-it-works.svg" alt="How It Works" className="w-full max-w-xs sm:max-w-sm md:max-w-md hidden md:block reveal" />
                    </div>
                </div>
            </section>
    
            {/* CTA Section */}
            <section
                id="cta"
                className="w-full h-[40vh] flex justify-center items-center snap-center bg-accentBlue text-center px-4"
            >
                <div className="max-w-4xl mx-auto text-center reveal">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white">Get Started Now</h2>
                    <p className="mt-4 text-base sm:text-lg font-medium text-white">Upload your image and start cropping with ease!</p>
                    <button
                        className="w-full sm:w-[30vh] mt-6 font-medium border-white border-2 bg-white text-textDark px-6 py-3 rounded-full cursor-pointer shadow-lg hover:text-accentBlue hover:font-semibold transition-all"
                        onClick={() => document.getElementById("upload")?.scrollIntoView({ behavior: "smooth" })}
                    >
                        Start Cropping
                    </button>
                </div>
            </section>
    
            <Footer />
        </div>
    );
    
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center border border-blue-200 flex flex-col items-center">
      <div className="text-4xl text-accentBlue mb-4 text-center">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-gray-700">{description}</p>
    </div>
  );
}

export default LandingPage;
