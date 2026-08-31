# 🌱 KrishiSetu - Smart Farming Prototype

KrishiSetu is an advisory platform for farmers providing real-time telemetry tracking and AI-driven crop disease diagnosis.

## Prerequisites
- Python 3.11+
- Node.js 18+

## Backend Setup
1. Open a terminal in the `backend` directory.
2. Create a virtual environment: `python -m venv venv`
3. Activate it:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Run the server: `uvicorn app.main:app --reload --port 8000`

The API and automated simulator will start immediately. Check `http://localhost:8000/docs` for API documentation.

## Frontend Setup
1. Open a terminal in the `frontend` directory.
2. Install dependencies: `npm install` (Requires standard Vite + React packages, MUI, Recharts, Axios, Lucide).
3. Create a `.env` file and add: `VITE_API_URL=http://localhost:8000/api`
4. Run the development server: `npm run dev`
5. Navigate to the local URL provided by Vite.

## PWA & Offline Support
To enable the Progressive Web App feature:
1. Ensure `vite-plugin-pwa` is installed.
2. The provided `public/manifest.webmanifest` handles home-screen installation.
3. The service worker caches the application shell. Telemetry gracefully degrades to showing the last-known cached data when offline.

## Model Replacement
The current prototype uses a deterministic OpenCV hash in `backend/app/diagnosis.py` to prevent large binary downloads for the demo. To integrate a real `.onnx` or `.tflite` model:
1. Place your model in `backend/models/`.
2. Update `process_and_diagnose()` to load the model (e.g., using `cv2.dnn.readNetFromONNX` or `tf.lite.Interpreter`).
3. Pass the normalized image tensor through the network and map the output array to your disease labels.