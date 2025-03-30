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
        <div className="bg-blue-50 text-gray-900 h-screen">
            <UploadPage setImage={setImage} setImageFile={setImageFile}/>

        {/* Features Section */}
            <section id = "features" className="features flex items-center justify-center flex-col text-center snap-center bg-gradient-to-b from-bgBlue to-[#F8FAFC] w-screen pb-[10vh]">
                <div className="max-w-6xl mx-auto reveal">
                    <h2 className="features-title text-5xl font-semibold text-accentBlue">Features</h2>
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
                        <FeatureCard icon={<FaCropAlt />} title="Multiple Crops" description="Select multiple areas from a single image effortlessly." />
                        <FeatureCard icon={<FaMagic />} title="AI Detection" description="Utilize AI to detect and crop objects based on your prompt." />
                        <FeatureCard icon={<FaDownload />} title="Customizable Cropping" description="Modify crop boxes by adjusting width, height, aspect ratio, and position." />
                    </div>
                </div>
            </section>
            <section id = "how-it-works" className=" how-it-works text-center snap-center w-screen h-screen bg-[#F8FAFC] flex items-center justify-center flex-row place-items-center">
                <div className="max-w-6xl grid grid-cols-[60%_40%] gap-8 place-items-center h-full">
                    <div className="rounded-2xl bg-accentBlue py-10 px-20 reveal ">
                        <h2 className="text-4xl font-semibold text-white">How It Works</h2>
                        <ol className="mt-8 text-lg text-left max-w-3xl mx-auto space-y-4 text-white">
                            <li><strong>1. Upload an Image:</strong> Supports JPG, JPEG, PNG, and WEBP formats.</li>
                            <li><strong>2. Choose Cropping Method:</strong> Manual cropping or AI-powered detection.</li>
                            <li><strong>3. AI Cropping:</strong> Enter a prompt, and AI will detect and crop the object you specify.</li>
                            <li><strong>4. Manual Cropping:</strong> If needed, adjust or create new crop boxes manually by clicking "Add Crop".</li>
                            <li><strong>5. Finalize Cropping:</strong> Click "Finish" when done.</li>
                            <li><strong>6. Download:</strong> Get your cropped images in a ZIP file.</li>
                        </ol>
                    </div>

                    <div className="flex justify-center items-center h-full">
                        <img src="/public/how-it-works.svg" alt="How It Works" className="w-full max-w-lg reveal" />
                    </div>  
                    
                </div>
                
            </section>
        

        {/* Call To Action (CTA) Section */}
        <section id = "cta" className=" w-screen h-2/5 flex justify-center items-center snap-center bg-accentBlue text-center">
            <div className="max-w-6xl mx-auto text-center reveal">
                <h2 className="text-4xl font-bold text-white">Get Started Now</h2>
                <p className="mt-4 text-lg font-medium text-white">Upload your image and start cropping with ease!</p>
                <button className=" w-[30vh] mt-6 font-medium border-white border-2 bg-white text-textDark px-6 py-3 rounded-full cursor-pointer shadow-lg hover:text-accentBlue hover:font-semibold" 
                onClick={() => document.getElementById("upload")?.scrollIntoView({ behavior: "smooth" })} >
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
