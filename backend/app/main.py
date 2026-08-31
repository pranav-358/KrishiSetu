import asyncio
import random
import math
from datetime import datetime, timedelta
from fastapi import FastAPI, Depends, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .models import SessionLocal, SensorLog, AdvisoryAlert, ControlState
from .agronomy import evaluate_conditions
from .diagnosis import process_and_diagnose

app = FastAPI(title="KrishiSetu API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Demo State
demo_state = ControlState()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Background Simulator ---
async def sensor_simulator():
    db = SessionLocal()
    time_step = 0
    while True:
        try:
            if demo_state.simulation_enabled:
                # Sinusoidal diurnal cycle simulation with noise
                time_step += 0.1
                temp = 25 + 15 * math.sin(time_step) + random.uniform(-0.5, 0.5)
                humidity = 90 - (temp * 1.5) + random.uniform(-2, 2)
                moisture = max(20, min(80, 50 + 20 * math.cos(time_step * 0.5) + random.uniform(-1, 1)))
            else:
                temp = demo_state.temperature
                humidity = demo_state.humidity
                moisture = demo_state.moisture_pct

            log = SensorLog(moisture_pct=round(moisture, 2), temperature=round(temp, 2), humidity=round(humidity, 2))
            db.add(log)
            db.commit()
            
            evaluate_conditions(db, moisture, temp, humidity)
            
        except Exception as e:
            print(f"Simulator error: {e}")
            db.rollback()
            
        await asyncio.sleep(5)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(sensor_simulator())

# --- API Endpoints ---
@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

@app.get("/api/telemetry/latest")
def get_latest_telemetry(db: Session = Depends(get_db)):
    reading = db.query(SensorLog).order_by(SensorLog.timestamp.desc()).first()
    return reading

@app.get("/api/telemetry/history")
def get_telemetry_history(hours: int = 24, db: Session = Depends(get_db)):
    cutoff = datetime.utcnow() - timedelta(hours=hours)
    return db.query(SensorLog).filter(SensorLog.timestamp >= cutoff).order_by(SensorLog.timestamp.asc()).all()

@app.get("/api/alerts")
def get_alerts(db: Session = Depends(get_db)):
    return db.query(AdvisoryAlert).order_by(
        AdvisoryAlert.status.asc(), # 'active' comes before 'resolved' alphabetically
        AdvisoryAlert.timestamp.desc()
    ).limit(50).all()

@app.patch("/api/alerts/{alert_id}")
def update_alert(alert_id: int, update: dict, db: Session = Depends(get_db)):
    alert = db.query(AdvisoryAlert).filter(AdvisoryAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.status = update.get("status", alert.status)
    db.commit()
    return {"success": True}

@app.post("/api/controls")
def update_controls(state: ControlState):
    global demo_state
    demo_state = state
    return demo_state

@app.get("/api/controls")
def get_controls():
    return demo_state

@app.post("/api/diagnose")
async def diagnose_image(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        raise HTTPException(status_code=400, detail="Only JPG/PNG supported")
    
    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 5MB)")
    
    try:
        result = process_and_diagnose(contents)
        
        # In a real app, generate alert based on rules
        if result["urgency"] == "high":
            db = SessionLocal()
            new_alert = AdvisoryAlert(
                category="Disease Detected", 
                severity="high", 
                message=f"{result['name']} detected ({result['confidence']}%). {result['treatment']}"
            )
            db.add(new_alert)
            db.commit()
            db.close()

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))