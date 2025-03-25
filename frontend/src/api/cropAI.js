export const fetchPrediction = async (image, prompt) => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("prompt", prompt);
  
    try {
      const response = await fetch("http://127.0.0.1:8000/predict/", {
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
  