from db.session import SessionLocal
from db.models import Listing
from db.init_db import init_db

init_db()

db = SessionLocal()

listing = Listing(
    title="Test",
    price=1000,
    city="Paris",
    source="manual",
    fingerprint="test-1"
)

db.add(listing)
db.commit()
db.close()