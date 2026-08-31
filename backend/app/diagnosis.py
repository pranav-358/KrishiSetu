import cv2
import numpy as np

def process_and_diagnose(file_bytes: bytes):
    """
    Mock adapter for ONNX/TFLite. Uses OpenCV to validate the image, 
    then deterministically returns a diagnosis based on file size/bytes 
    to simulate a real ML pipeline without requiring a heavy model file.
    """
    nparr = np.frombuffer(file_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        raise ValueError("Invalid image file")

    # Mock preprocessing (Resize & Normalize as if for TFLite)
    resized = cv2.resize(img, (224, 224))
    normalized = resized / 255.0

    # Deterministic mock inference based on image array sum
    img_hash = int(np.sum(normalized)) % 3
    
    diseases = [
        {
            "name": "Healthy Crop",
            "confidence": 98.5,
            "treatment": "No action needed.",
            "prevention": "Continue standard watering and fertilization schedule.",
            "urgency": "low"
        },
        {
            "name": "Leaf Blight",
            "confidence": 89.2,
            "treatment": "Apply copper-based fungicide. Remove affected leaves.",
            "prevention": "Ensure adequate spacing between plants for airflow.",
            "urgency": "high"
        },
        {
            "name": "Powdery Mildew",
            "confidence": 92.1,
            "treatment": "Apply sulfur or potassium bicarbonate spray.",
            "prevention": "Water at the base of the plant, avoid overhead irrigation.",
            "urgency": "medium"
        }
    ]
    
    return diseases[img_hash]