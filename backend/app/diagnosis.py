import cv2
import numpy as np
import tensorflow as tf
import json
import os

# 1. Setup paths so FastAPI can find the model files
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "crop_model.tflite")
CLASSES_PATH = os.path.join(BASE_DIR, "models", "class_names.json")

# 2. Load the 47 disease labels
with open(CLASSES_PATH, "r") as f:
    CLASS_NAMES = json.load(f)

# 3. Load the TFLite AI Model into memory
interpreter = tf.lite.Interpreter(model_path=MODEL_PATH)
interpreter.allocate_tensors()
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

def process_and_diagnose(file_bytes: bytes):
    """Passes the uploaded image through the real CNN model."""
    
    # 1. Read the image from the frontend upload
    nparr = np.frombuffer(file_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Invalid image file")

    # 2. Resize and Format (224x224 RGB)
    resized = cv2.resize(img, (224, 224))
    rgb_img = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)
    
    # 3. Prepare Input Data
    # Because your new model has Rescaling baked in, we pass raw 0-255 values
    input_data = np.expand_dims(rgb_img, axis=0).astype(np.float32)

    # 4. Run Inference
    interpreter.set_tensor(input_details[0]['index'], input_data)
    interpreter.invoke()
    predictions = interpreter.get_tensor(output_details[0]['index'])[0]

    # 5. Map Results
    best_idx = np.argmax(predictions)
    confidence = float(predictions[best_idx]) * 100
    predicted_class = CLASS_NAMES[best_idx]

    # Clean up the dataset folder name
    clean_name = predicted_class.replace("___", ": ").replace("_", " ")

    # --- DEBUG LOGS (Watch your FastAPI terminal) ---
    print(f"\n--- INFERENCE DEBUG ---")
    print(f"Input Min: {input_data.min():.2f} | Input Max: {input_data.max():.2f}")
    print(f"Top Class Index: {best_idx} -> {clean_name}")
    print(f"Top 3 Raw Scores: {sorted(predictions, reverse=True)[:3]}")
    print(f"-----------------------\n")

    # 6. Return the result to the React dashboard
    return {
        "name": clean_name,
        "confidence": round(confidence, 1),
        "treatment": "Consult a local agronomist for specific fungicide or pesticide recommendations.",
        "prevention": "Ensure proper crop spacing, monitor irrigation cycles, and remove infected plant debris.",
        "urgency": "low" if "healthy" in clean_name.lower() else "high"
    }