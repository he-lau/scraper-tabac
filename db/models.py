# db/models.py

from sqlalchemy import Column, Integer, String, Float, JSON, Boolean, DateTime, ForeignKey, UniqueConstraint, text
from sqlalchemy.orm import relationship
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
    created_at = Column(DateTime, server_default=text("NOW()"))
    extras = Column(JSON)


class User(Base):
    __tablename__ = "users"

    id         = Column(Integer, primary_key=True)
    email      = Column(String, unique=True, nullable=False, index=True)
    password   = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=text("NOW()"))

    favorites  = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")


class Favorite(Base):
    __tablename__ = "favorites"

    id         = Column(Integer, primary_key=True)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=False)
    created_at = Column(DateTime, server_default=text("NOW()"))

    user    = relationship("User", back_populates="favorites")
    listing = relationship("Listing")

    __table_args__ = (
        UniqueConstraint("user_id", "listing_id", name="uq_user_listing"),
    )