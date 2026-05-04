import os
import resend
from scraper.logger import logger
from db.models import Alert, User

resend.api_key = os.getenv("RESEND_API_KEY")
RESEND_FROM = os.getenv("RESEND_FROM")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")


def listing_matches(listing, alert):
    if alert.keywords:
        text = ((listing.title or "") + " " + (listing.description or "")).lower()
        if alert.keywords.lower() not in text:
            return False
    if alert.source and listing.source != alert.source:
        return False
    if alert.price_min and listing.price and listing.price < alert.price_min:
        return False
    if alert.price_max and listing.price and listing.price > alert.price_max:
        return False
    if alert.region and listing.region != alert.region:
        return False
    return True


def _listing_card(listing):
    price = f"{int(listing.price):,} €".replace(",", " ") if listing.price else "Prix non communiqué"
    location = " · ".join(filter(None, [listing.city, listing.department, listing.region]))
    url = listing.url or FRONTEND_URL
    return f"""
      <div style="border:1px solid #E8E8E3;border-radius:10px;padding:16px 20px;margin-bottom:12px">
        <p style="font-size:13px;font-weight:600;margin:0 0 4px">{listing.title or "Sans titre"}</p>
        <p style="font-size:12px;color:#888;margin:0 0 8px">{location} · {listing.source}</p>
        <p style="font-size:14px;font-weight:700;margin:0 0 12px">{price}</p>
        <a href="{url}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:7px 16px;border-radius:7px;font-size:12px">
          Voir l'annonce
        </a>
      </div>
    """


def _send_alert_email(user_email, alert_name, listings):
    cards = "".join(_listing_card(l) for l in listings)
    count = len(listings)
    subject = f"{count} nouvelle{'s' if count > 1 else ''} annonce{'s' if count > 1 else ''} — {alert_name or 'Alerte Tabac · Bar · FDJ'}"

    resend.Emails.send({
        "from": RESEND_FROM,
        "to": user_email,
        "subject": subject,
        "html": f"""
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px">
            <p style="font-size:10px;color:#888;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 4px">scraper</p>
            <h1 style="font-size:20px;font-weight:600;margin:0 0 8px">Tabac · Bar · FDJ</h1>
            <p style="font-size:13px;color:#555;margin:0 0 24px">
              {count} nouvelle{'s' if count > 1 else ''} annonce{'s' if count > 1 else ''} correspond{'ent' if count > 1 else ''} à votre alerte
              <strong>{alert_name or ''}</strong>.
            </p>
            {cards}
            <p style="font-size:11px;color:#aaa;margin-top:32px">
              Vous recevez cet email car vous avez configuré une alerte sur Tabac · Bar · FDJ.<br>
              <a href="{FRONTEND_URL}/alerts" style="color:#aaa">Gérer mes alertes</a>
            </p>
          </div>
        """,
    })


def dispatch_alerts(db, new_listings):
    if not new_listings:
        return

    alerts = db.query(Alert).filter_by(active=True).join(User).all()
    if not alerts:
        return

    # Groupe les matches par alerte
    for alert in alerts:
        matches = [l for l in new_listings if listing_matches(l, alert)]
        if not matches:
            continue
        try:
            _send_alert_email(alert.user.email, alert.name, matches)
            logger.info(f"📧 Alerte '{alert.name}' → {alert.user.email} ({len(matches)} annonces)")
        except Exception as e:
            logger.error(f"❌ Erreur envoi alerte {alert.id}: {e}")
