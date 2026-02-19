# app/models/weather.py
from sqlalchemy import Column, String, Float, DateTime
from app.db.database import Base
import uuid

class WeatherRecord(Base):
    __tablename__ = "weather"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    city = Column(String, nullable=False)
    datetime = Column(DateTime, nullable=False)
    temperature = Column(Float, nullable=False)
    precipitation = Column(Float, nullable=False)
