# 🖼️ MultiCropper AI

**MultiCropper AI** is a web application that enables users to upload an image, manually add multiple crop boxes, or use AI (GroundingDINO) to automatically detect objects for cropping. It streamlines the image cropping process, especially for catalogs, thumbnails, and dataset preparation.

---

## 📘 Product Specification

### 🔍 Problem Statement  
Cropping images manually is tedious and inefficient, particularly when working with multiple objects or batch processing for product catalogs or machine learning datasets.

### 💡 Solution Overview  
MultiCropper AI provides an intuitive interface for manual and automatic image cropping, powered by GroundingDINO for object detection. Users can quickly generate high-quality cropped images with minimal effort.

### 🧠 Key Features

- **Flexible File Support:** Upload and crop from various image formats including PNG, JPG/JPEG, and WEBP.  
- **Manual Cropping:** Add custom bounding boxes to images.  
- **Automatic Detection:** Use AI (GroundingDINO) to detect objects and auto-generate crop boxes.  
- **Multi-crop Support:** Crop multiple regions from the same image.  
- **Interactive Cropping Experience:** Preview, delete, and rename each cropped image directly from the web interface
- **Download All Results:** Export all cropped segments instantly in one ZIP file.  

### 🔄 Workflow

1. **Upload** your image on the Upload Page.
2. Select how you want your image to be cropped:
   - Click **Manual Crop** to add bounding boxes manually by placing the bounding box and click **Add Crop**, or
   - Click **Use AI** to generate boxes using AI by inputting the object names.
3. Once the image are cropped, you can see the cropped images and rename or remove each cropped image as needed.
3. Click **Finish** to be directed to **Download Page** and download your cropped results in a `.zip` file.

---

## 🧪 Tech Stack & Reason

| Technology     | Reason for Choice |
|----------------|------------------|
| **React.js**   | For fast, interactive, and modular front-end development with routing support. |
| **FastAPI**    | Lightweight, async-ready backend with built-in OpenAPI documentation and high performance. |
| **GroundingDINO** | State-of-the-art model for zero-shot object detection with natural language prompts. |
| **Docker**     | To ensure environment consistency, simplify deployment, and enable scalability across cloud platforms. |
| **Vercel**     | Easy frontend deployment with CI/CD integration. |
| **Google Cloud Run** | Backend hosting with auto-scaling and efficient storage of large models or outputs. |

---

## 📦 Installation

### Clone Repo

```bash
git clone https://github.com/maevezhw/multicropper.git
cd multicropper
```

### Backend (FastAPI, Docker required)
```bash
cd backend
docker build -t multicropper-backend .
docker run -p 8000:8000 multicropper-backend
```

### Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Project Structure

```
MULTICROPPER/
├── backend/
│ └── app/
│   ├── pycache/ # Python bytecode cache
│   ├── GroundingDINO/ # AI model logic and configs
│   ├── Dockerfile # Docker config for backend
│   ├── main.py # FastAPI main app file
│   └── requirements.txt # Python dependencies
├── frontend/
│ ├── public/ # Static assets (SVGs, icons)
│ │ ├── how-it-works.svg
│ └── src/
│   ├── api/
│       ├──  cropAI.js # API request to AI backend
│   └── components/ # All React components
│       ├── AspectRatioSelector.jsx # UI for selecting aspect ratio
│       ├── ConfirmBeforeUnload.jsx # Warn user before leaving page
│       ├── CropperPage.jsx # Main cropping interface page
│       ├── CropperSetting.jsx # Settings/options for cropping
│       ├── DownloadPage.jsx # UI for image download
│       ├── ErrorModal.jsx # Modal shown on error
│       ├── Footer.jsx # App footer
│       ├── ImageCropper.jsx # Core image cropper logic
│       ├── LandingPage.jsx # Landing/start page
│       ├── LoadingModal.jsx # Loading state/modal
│       ├── Navbar.jsx # Top navigation bar
│       ├── UploadPage.jsx # Image upload page
│       ├── App.jsx # Main React app entry
│       ├── index.css # Global CSS
│       └── main.jsx # React DOM entry point
```

---

## 📊 Business Plan

### 🌐 Target Users

- E-commerce product managers
- Dataset curators / AI practitioners
- Designers needing batch image cropping

### 🥊 Competitive Landscape

| Feature                    | MultiCropper| iLoveIMG | Image Resizer | Img2Go |
|----------------------------|-------------|-----------|--------------|--------|
| AI-powered multi crop      | ✅          | ❌        | ❌            | ❌     |
| Manual multi crop          | ✅          | ❌        | ❌            | ✅     |
| No image storage (private) | ✅          | ❌        | ❌            | ❌     |
| Open-source / customizable | ✅          | ❌        | ❌            | ❌     |

### 💰 Monetization Plans

- **Freemium with Premium Features**
  - Free Tier: Manual cropping, basic export formats.
  - Premium tier:
    - AI-powered cropping
    - Custom export formats (*future*)
    - Cloud sync (upload from and save to cloud) (*future*)
    - Remove ads (*future*)
  
- **Subscription Plans**
    - **Personal Plan**:
        - Monthly/quarterly access to premium features
    - **Pro/Team Plan**:
        - For professionals or small teams
        - Includes team collaboration and cloud sync
        - Access to advanced export options and integrations

- **Pay-per-Use (Credit-Based Model)**
    - Users purchase credits to unlock features like:
        - AI crop
        - Premium export formats
        - Cloud sync

- **Ad-Supported Lite Version**
    - Monetize free-tier users with non-intrusive ads
    - Can be disabled in premium accounts

---

## 🔒 Data Privacy

> This application **does not store** any uploaded images or cropped results.  
> All image processing is handled in-memory on your session.  
> No files are stored on the server, ensuring full privacy and security.

---

## 🗺️ Future Plans

- [ ] Refactor the code to make it clean & faster
- [ ] Enhance the AI model for more accurate and fine-grained object detection, including support for prompt-based and highly specific prompts.  
- [ ] Integrate cloud storage — allowing users to both **import images directly from the cloud** and **save their cropped results to the cloud**.  
- [ ] Implement user authentication so users can **track their progress**, **view previous cropping history**, and **manage their data securely**.  
- [ ] Provide options to **download cropped results in multiple formats** (e.g., JPG, PNG, or WEBP) based on user preferences.
- [ ] Redesign the interface

---
## 🧑‍💻 Author

Created with 🩵 by [@maevezhw](https://github.com/maevezhw). Connect with me through [LinkedIn](https://www.linkedin.com/in/maeve-zahwa-acz).

---
