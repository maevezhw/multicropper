const fetchPrediction = async (image, prompt) => {
    const processed_prompt = prompt.replace(/,/g, " .");
    const formData = new FormData();
    formData.append("file", image);
    formData.append("prompt", processed_prompt);

    try {
        const response = await fetch("https://backend-multicropper-531257777288.us-central1.run.app/predict/", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (data.results) {
            return data.results; // Hasil prediksi
        } else {
            
            throw new Error(data.error || "Unexpected error");
        }
    } catch (error) {
        
        console.error("API call failed:", error);
        throw error; // Mengembalikan error untuk ditangani di komponen
    }
};

export { fetchPrediction };
