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
CSV_PATH = os.path.join(BASE_DIR, "data", "crop_disease_data.csv")

# 2. Load the 43 disease labels
with open(CLASSES_PATH, "r") as f:
    CLASS_NAMES = json.load(f)

# 3. Load the CSV Database into memory
disease_database = []
try:
    # 'utf-8-sig' safely removes invisible Excel characters
    with open(CSV_PATH, mode='r', encoding='utf-8-sig') as csv_file:
        reader = csv.DictReader(csv_file)
        
        # BUG FIX 1: Strip invisible spaces from column headers (fixes " Fertilizer")
        if reader.fieldnames:
            reader.fieldnames = [field.strip() for field in reader.fieldnames]
            
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
    
    nparr = np.frombuffer(file_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Invalid image file")

    resized = cv2.resize(img, (224, 224))
    rgb_img = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)
    
    input_data = np.expand_dims(rgb_img, axis=0).astype(np.float32)

    interpreter.set_tensor(input_details[0]['index'], input_data)
    interpreter.invoke()
    predictions = interpreter.get_tensor(output_details[0]['index'])[0]

    best_idx = np.argmax(predictions)
    confidence = float(predictions[best_idx]) * 100
    predicted_class = CLASS_NAMES[best_idx]

    if "soyabean" in predicted_class.lower() and "dataset" in predicted_class.lower():
        predicted_class = "Soybean___Rust"

    clean_name = predicted_class.replace("___", ": ").replace("_", " ")

    # 6. Database Smart Search
    parts = predicted_class.split("___")
    ai_crop = parts[0].replace("_", " ").lower()
    ai_disease = parts[1].replace("_", " ").lower() if len(parts) > 1 else ""

    # Default fallbacks
    treatment_text = "Consult a local agronomist for specific fungicide or pesticide recommendations."
    prevention_text = "Ensure proper crop spacing, monitor irrigation cycles, and remove infected plant debris."
    fertilizer_text = "Maintain standard NPK balanced fertilizer for optimal soil health."

    # Loop through the CSV to find the matching row
    for row in disease_database:
        csv_crop = str(row.get("Crop Name", "")).lower()
        csv_disease = str(row.get("Disease", "")).lower()

        if (csv_crop in ai_crop) and (csv_disease in ai_disease or ai_disease in csv_disease):
            
            # BUG FIX 2: Look for the EXACT column names inside your CSV
            if row.get("Treatment"):
                treatment_text = row.get("Treatment").strip()
                
            if row.get("Prevention"):
                prevention_text = row.get("Prevention").strip()
                
            if row.get("Fertilizer"):
                fertilizer_text = row.get("Fertilizer").strip()
            
            break

    print(f"\n--- INFERENCE DEBUG ---")
    print(f"Top Class Index: {best_idx} -> {clean_name}")
    print(f"Treatment Fetched: {treatment_text[:30]}...")
    print(f"-----------------------\n")

    return {
        "name": clean_name,
        "confidence": round(confidence, 1),
        "treatment": "None needed for healthy plants!" if "healthy" in clean_name.lower() else treatment_text,
        "prevention": "Maintain current care routine." if "healthy" in clean_name.lower() else prevention_text,
        "fertilizer": fertilizer_text,
        "urgency": "low" if "healthy" in clean_name.lower() else "high"
    }