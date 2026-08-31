from sqlalchemy.orm import Session
from .models import AdvisoryAlert

def evaluate_conditions(db: Session, moisture: float, temp: float, humidity: float):
    alerts = []
    
    # Rule 1: Irrigation alert
    if moisture < 30 and temp > 32:
        alerts.append(("Irrigation", "high", "Soil is dry and hot. Recommend immediate irrigation."))
        
    # Rule 2: Heat stress alert
    if temp > 38 and humidity < 25:
        alerts.append(("Heat Stress", "high", "Extreme heat and low humidity. Recommend shade and light irrigation."))
        
    # Rule 3: Moderate dryness
    if 30 <= moisture <= 40:
        alerts.append(("Dryness", "medium", "Moisture dropping. Check irrigation within the next few hours."))

    for category, severity, message in alerts:
        # Deduplication: Check if active alert already exists for this category
        existing = db.query(AdvisoryAlert).filter(
            AdvisoryAlert.category == category, 
            AdvisoryAlert.status == "active"
        ).first()
        
        if not existing:
            new_alert = AdvisoryAlert(category=category, severity=severity, message=message)
            db.add(new_alert)
            db.commit()