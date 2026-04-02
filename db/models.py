# db/models.py

from sqlalchemy import Column, Integer, String, Float, JSON, Boolean, DateTime
from datetime import datetime
from db.base import Base

'''
class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    price = Column(Float)
    city = Column(String)
    source = Column(String)
    fingerprint = Column(String, unique=True, index=True)
'''

class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    price = Column(Float)
    address = Column(String)
    city = Column(String)
    department = Column(String)    
    region = Column(String)
    source = Column(String)
    description = Column(String)
    url = Column(String)
    fingerprint = Column(String, unique=True, index=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    extras = Column(JSON)  # from sqlalchemy import JSON