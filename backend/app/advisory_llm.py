import os
import json
import urllib.request
from dotenv import load_dotenv

load_dotenv()

# Configure the API key if available
gemini_api_key = os.getenv("GEMINI_API_KEY")

def generate_agronomy_advice(crop_type: str, land_size: str, disease: str, telemetry: dict) -> str:
    """
    Generates AI agronomy advice based on current parameters.
    Falls back to a smart mock response if no API key is provided.
    """
    prompt = f"""
    You are an expert Agronomist and Smart Farming AI Assistant.
    Provide actionable, precise advice for the following scenario:
    
    Crop Type: {crop_type}
    Land Size: {land_size}
    Current Disease Detected: {disease if disease else 'None'}
    
    Current Field Telemetry:
    - Temperature: {telemetry.get('temperature', 'Unknown')} °C
    - Humidity: {telemetry.get('humidity', 'Unknown')} %
    - Soil Moisture: {telemetry.get('moisture', 'Unknown')} %
    
    Provide:
    1. Precise chemical or organic dosage recommendation (per acre/hectare).
    2. Irrigation recommendations based on the telemetry.
    3. Any immediate actions to prevent the spread of the disease or mitigate environmental stress.
    
    Keep the advice concise, bulleted, and professional.
    """

    if gemini_api_key and gemini_api_key != "your_api_key_here":
        models_to_try = ["gemini-3.5-flash", "gemini-pro-latest", "gemini-2.5-flash"]
        last_error = ""
        
        for model in models_to_try:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={gemini_api_key}"
                data = {
                    "contents": [{"parts": [{"text": prompt}]}]
                }
                req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'}, method='POST')
                with urllib.request.urlopen(req) as response:
                    result = json.loads(response.read().decode('utf-8'))
                    return result['candidates'][0]['content']['parts'][0]['text']
            except urllib.error.HTTPError as e:
                error_body = e.read().decode('utf-8')
                last_error = f"HTTP {e.code}: {error_body}"
                # If it's a 503 (Unavailable), loop to the next model. 
                # If it's a 400 or 403 (Bad Request / Forbidden), API key is likely wrong, so break early.
                if e.code in [400, 403]:
                    return f"Error connecting to AI: {last_error}"
                continue
            except Exception as e:
                last_error = str(e)
                continue
                
        # If all models failed (e.g. 503s), return the mock response instead of completely failing
        pass
        # Fallback Mock Rule-based Response
        advice = f"**Simulated AI Advice for {crop_type} ({land_size})**\n\n"
        
        if disease and disease.lower() != "healthy" and disease.lower() != "none":
            advice += f"**Disease Management ({disease}):**\n"
            advice += f"- **Chemical Dosage:** Apply appropriate fungicide/pesticide at a rate of 250ml per acre.\n"
            advice += f"- **Organic Alternative:** Use Neem oil extract (10,000 ppm) mixed at 5ml per liter of water.\n\n"
        else:
            advice += f"**Crop Health:** No severe disease detected. Maintain standard preventative care.\n\n"
            
        temp = telemetry.get('temperature', 30)
        moisture = telemetry.get('moisture', 50)
        
        advice += f"**Irrigation & Climate:**\n"
        if moisture < 40 and temp > 30:
            advice += "- **Action Required:** Soil moisture is low and temperature is high. Initiate drip irrigation for 2-3 hours during late evening or early morning to prevent water stress.\n"
        elif moisture > 70:
            advice += "- **Action Required:** High soil moisture detected. Suspend irrigation to prevent waterlogging and root rot.\n"
        else:
            advice += "- **Status:** Current moisture levels are optimal. Maintain regular irrigation schedule.\n"
            
        advice += f"\n*(Note: This is a simulated response because the AI API is either unconfigured or currently overloaded. Please try again later for real-time GenAI recommendations.)*"
        return advice
