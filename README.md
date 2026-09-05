# 🌾 KrishiSetu — Smart Farming AI

> AI-powered crop disease detection and agricultural monitoring assistant

KrishiSetu is an AI-driven smart farming prototype that helps farmers detect crop diseases early. Users upload or capture a crop leaf image through a web dashboard, and the system analyzes it using a trained deep learning model to predict the disease and display the result instantly.

🚧 **Project Status:** Active Development / Prototype

---

## ✨ Key Features

- 🌱 AI-based crop disease detection
- 📸 Upload crop/leaf images for diagnosis
- 🧠 Custom-trained MobileNetV2 deep learning model
- ⚡ Fast prediction using TensorFlow Lite
- 🌾 Supports 47 crop disease/healthy classes
- 🔬 Image preprocessing using OpenCV
- 🚀 FastAPI-based backend
- 💻 Modern React + Vite dashboard
- 📊 Simple, user-friendly diagnosis interface
- 🔌 REST API architecture
- 📱 Built with future mobile/on-device deployment in mind

---

## 🎯 Problem Statement

Farmers often struggle to identify crop diseases at an early stage. Traditional identification methods require expert agricultural knowledge, manual inspection, or lab testing — all slow and often inaccessible. Late detection leads to reduced yield, higher pesticide use, increased costs, and disease spread.

### 💡 Solution

KrishiSetu uses computer vision and deep learning to analyze crop leaf images and instantly predict the disease, giving farmers a fast, low-cost diagnostic tool.


The model has a built-in **Rescaling** layer that converts pixel values from `0–255` to `-1 to 1`, so no manual normalization is needed before inference.

### Dataset
Trained on a combination of:
- 🌿 PlantVillage
- 🌱 Cotton disease datasets
- 🌾 Soybean disease datasets

### Supported Classes
47 disease and healthy-state classes, maintained in `backend/models/class_names.json`:
```json
[
  "Healthy",
  "Disease_1",
  "Disease_2",
  "Disease_3"
]
```
*(Actual class names depend on the trained model.)*

---

## ⚙️ Technology Stack

**Frontend:** React.js, Vite, HTML, CSS, JavaScript
**Backend:** Python, FastAPI, Uvicorn, OpenCV
**AI/ML:** TensorFlow, TensorFlow Lite, MobileNetV2, Transfer Learning, Computer Vision

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- pip
- Node.js & npm
- Git

Check installations:
```bash
python --version
pip --version
node --version
npm --version
```

### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv        # Windows
python3 -m venv venv       # Linux/macOS

# Activate it
venv\Scripts\activate      # Windows
source venv/bin/activate   # Linux/macOS

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload --port 8000
```
Backend: `http://localhost:8000`
API docs: `http://localhost:8000/docs`

### Frontend Setup
```bash
cd frontend-clean
npm install
npm run dev
```
Frontend: `http://localhost:5173`

### Running Both
Open two terminals — one for backend, one for frontend — then visit `http://localhost:5173`.

---

## 🔌 API Workflow
    React Frontend → Image → FastAPI Endpoint → OpenCV Processing
    → TensorFlow Lite → MobileNetV2 → Prediction → JSON Response → Dashboard

## 🤝 Contributing

```bash
# Fork the repository, then:
git clone https://github.com/pranav-358/KrishiSetu
cd KrishiSetu
git checkout -b feature/your-feature

# Make your changes, then:
git add .
git commit -m "Add new feature"
git push origin feature/your-feature
```Then open a Pull Request.


### 🌾 KrishiSetu
> "Connecting Farmers with AI for Smarter, Healthier Crops."

⭐ If you find this project useful, consider giving the repository a star!
