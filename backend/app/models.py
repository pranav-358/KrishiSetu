from datetime import datetime
from sqlalchemy import Column, Integer, Float, String, DateTime, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from pydantic import BaseModel

Base = declarative_base()
engine = create_engine("sqlite:///../database.sqlite3", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# --- SQLAlchemy Models ---
class SensorLog(Base):
    __tablename__ = "sensor_logs"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    moisture_pct = Column(Float)
    temperature = Column(Float)
    humidity = Column(Float)

class AdvisoryAlert(Base):
    __tablename__ = "advisory_alerts"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    category = Column(String, index=True)
    severity = Column(String)
    message = Column(String)
    status = Column(String, default="active", index=True) # active, acknowledged, resolved

Base.metadata.create_all(bind=engine)

# --- Pydantic Schemas ---
class ControlState(BaseModel):
    simulation_enabled: bool = True
    moisture_pct: float = 50.0
    temperature: float = 30.0
    humidity: float = 50.0

class AlertUpdate(BaseModel):
    status: str