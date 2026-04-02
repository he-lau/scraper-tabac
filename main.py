from scraper.sites.cessionpme import CessionPMEScraper
from scraper.sites.huarenjie import HuarenjieScraper
from scraper.normalize import normalize
from db.session import SessionLocal
from db.models import Listing
from db.init_db import init_db
from scraper.logger import logger



SCRAPERS = [
    CessionPMEScraper(),
    HuarenjieScraper()
]

init_db()
db = SessionLocal()

try:
    logger.info("🚀 Lancement du scraper...")

    for scraper in SCRAPERS:
        logger.info(f"🔍 Scraping avec {scraper.name}...")

        try:
            results = scraper.scrape()
            #results = scraper.test()
        except Exception as e:
            logger.error(f"❌ Erreur sur {scraper.name} : {e}")
            continue
    
        inserted = 0
        for raw in results:
            dto = normalize(raw)

            # Évite les doublons via le fingerprint
            exists = db.query(Listing).filter_by(fingerprint=dto.fingerprint).first()
            if exists:
                continue

            # listing = Listing(**vars(dto))
            listing = Listing(**dto.__dict__)

            db.add(listing)
            inserted += 1

        db.commit()
        logger.success(f"✅ {inserted}/{len(results)} annonces insérées pour {scraper.name}")
finally:
    db.close()