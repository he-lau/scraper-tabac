import hashlib
from dataclasses import dataclass
from typing import Optional, Dict, Any
from datetime import datetime

@dataclass
class ListingDTO:
    source: str
    title: str
    price: Optional[float]
    city: Optional[str]
    department: Optional[str]
    address: Optional[str]
    region: Optional[str]
    description: Optional[str]
    url: str
    fingerprint: str
    is_active: bool
    extras: Optional[Dict[str, Any]]
    created_at: datetime


def parse_price(raw_price):
    if not raw_price:
        return None
    cleaned = (raw_price
        .replace(" ", "")
        .replace("\xa0", "")
        .replace("€", "")
        .replace(",", ".")
    )
    try:
        return float(cleaned)
    except ValueError:
        return None


def normalize(raw):
    return ListingDTO(
        source=raw["source"],
        title=raw["title"],
        price=parse_price(raw.get("price")),
        city=raw.get("city"),
        department=raw.get("department"),
        address=raw.get("address"),
        region=raw.get("region"),
        description=raw.get("description"),
        url=raw["url"],
        fingerprint=hashlib.md5(raw["url"].encode()).hexdigest(),
        is_active=raw.get("is_active", True),
        extras=raw.get("extras"),
        created_at=raw.get("created_at", datetime.utcnow()),
    )