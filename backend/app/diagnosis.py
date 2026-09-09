import cv2
import numpy as np
import tensorflow as tf
import json
import os
import csv

# 1. Setup paths so FastAPI can find all files
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "crop_model.tflite")
CLASSES_PATH = os.path.join(BASE_DIR, "models", "class_names.json")
CSV_PATH = os.path.join(BASE_DIR, "data", "crop_desease_data.csv")

# 2. Load the 43 disease labels
with open(CLASSES_PATH, "r") as f:
    CLASS_NAMES = json.load(f)

# 3. Load the CSV Database into memory
disease_database = []
try:
    with open(CSV_PATH, mode='r', encoding='utf-8') as csv_file:
        reader = csv.DictReader(csv_file)
        for row in reader:
            disease_database.append(row)
    print(f"✅ Successfully loaded {len(disease_database)} treatment records from CSV.")
except Exception as e:
    print(f"⚠️ Warning: Could not load CSV database. Error: {e}")

# 4. Load the TFLite AI Model into memory
interpreter = tf.lite.Interpreter(model_path=MODEL_PATH)
interpreter.allocate_tensors()
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

def process_and_diagnose(file_bytes: bytes):
    """Passes the uploaded image through the CNN model and fetches dynamic treatments."""
    
    # 1. Read the image from the frontend upload
    nparr = np.frombuffer(file_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Invalid image file")

    # 2. Resize and Format (224x224 RGB)
    resized = cv2.resize(img, (224, 224))
    rgb_img = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)
    
    # 3. Prepare Input Data
    input_data = np.expand_dims(rgb_img, axis=0).astype(np.float32)

    # 4. Run Inference
    interpreter.set_tensor(input_details[0]['index'], input_data)
    interpreter.invoke()
    predictions = interpreter.get_tensor(output_details[0]['index'])[0]

    # 5. Map AI Results
    best_idx = np.argmax(predictions)
    confidence = float(predictions[best_idx]) * 100
    predicted_class = CLASS_NAMES[best_idx]  # e.g., "Tomato___Early_blight"

    clean_name = predicted_class.replace("___", ": ").replace("_", " ")

    # 6. Database Smart Search (Matching AI output to your specific CSV headers)
    parts = predicted_class.split("___")
    ai_crop = parts[0].replace("_", " ").lower()
    ai_disease = parts[1].replace("_", " ").lower() if len(parts) > 1 else ""

    # Default fallbacks if the specific disease isn't typed in the CSV yet
    treatment_text = "Consult a local agronomist for specific fungicide or pesticide recommendations."
    prevention_text = "Ensure proper crop spacing, monitor irrigation cycles, and remove infected plant debris."

    # Loop through the CSV to find the matching row
    for row in disease_database:
        csv_crop = row.get("Crop Name", "").lower()
        csv_disease = row.get("Disease", "").lower()

        # Check if the AI's prediction matches the CSV row
        if (csv_crop in ai_crop) and (csv_disease in ai_disease or ai_disease in csv_disease):
            # Grab the specific data using your exact CSV headers
            treatment_text = row.get("Chemical Recommendation", treatment_text)
            prevention_text = row.get("Home Remedy", prevention_text)
            break

    # --- DEBUG LOGS (Watch your FastAPI terminal) ---
    print(f"\n--- INFERENCE DEBUG ---")
    print(f"Top Class Index: {best_idx} -> {clean_name}")
    print(f"Treatment Match: {'✅ Found in CSV' if 'Consult a local agronomist' not in treatment_text else '⚠️ Default Fallback Used'}")
    print(f"-----------------------\n")

    # 7. Return the combined result to the React dashboard
    return {
        "name": clean_name,
        "confidence": round(confidence, 1),
        "treatment": treatment_text,
        "prevention": prevention_text,
        "urgency": "low" if "healthy" in clean_name.lower() else "high"
    }