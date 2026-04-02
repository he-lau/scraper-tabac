# db/init_db.py

from db.session import engine
from db.base import Base
import db.models

def init_db():
    Base.metadata.create_all(bind=engine)