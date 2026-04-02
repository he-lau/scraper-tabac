from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import time
from scraper.logger import logger

BASE_URL = "https://www.cessionpme.com/"

class CessionPMEScraper:
    name = "cessionpme"

    def clean_price(self, prix):
        if not prix:
            return None
        prix = prix.replace("\xa0", " ").replace("€", "")
        prix = prix.replace("Prix de vente :", "").replace("Prix :", "")
        return prix.strip()

    def scrape(self):
        results = []

        with sync_playwright() as p:
            browser = p.chromium.launch(
                headless=True,
                args=["--no-sandbox", "--disable-dev-shm-usage"]
            )

            page = browser.new_page()

            for i in range(1, 2):

                logger.info(f"📄 Scraping page {i}...")

                ou_fdc = "Ile+de+France"

                url = f"{BASE_URL}index.php?action=affichage&annonce=offre&page={i}&moteur=OUI&type_moteur=fdc&nature_fdc=V&secteur_activite_fdc=Bar+-+Brasserie+-+Tabac&motcle_fdc=tabac"

                page.goto(url, timeout=60000)

                try:
                    page.wait_for_selector("a.titre-annonce", timeout=10000)
                except:
                    page.wait_for_timeout(5000)

                html = page.content()

                if "Accès restreint" in html:
                    logger.error("🚫 Bloqué par anti-bot !")
                    continue

                soup = BeautifulSoup(html, "html.parser")

                blocs = soup.select("div.bg-white.w-100.relative.d-md-flex.mb-4")


                for bloc in blocs:
                    titre_tag = bloc.select_one("a.titre-annonce")
                    prix_tag = bloc.select_one(".prix_raw")

                    if not titre_tag:
                        continue

                    mots_cles = ["tabac", "fdj", "loto", "pmu"]

                    texte = titre_tag.get_text(strip=True).lower()

                    if not any(mot in texte for mot in mots_cles):
                        continue    

                    description_tag = bloc.select_one("div.fs-0-9")
                    description = description_tag.get_text(strip=True) if description_tag else None

                    lien = BASE_URL + titre_tag["href"]

                    page.goto(lien, timeout=60000)
                    detail_html = page.content()
                    detail_soup = BeautifulSoup(detail_html, "html.parser")

                    breadcrumbs = detail_soup.select("ol#breadcrumbs-one li")
                    city, department, region = None, None, None

                    for crumb in breadcrumbs:
                        text = crumb.get_text(strip=True)

                        if "(" in text:  # Nancy (54000)
                            city = text.split("(")[0].strip()

                        elif text and text[0].isdigit():  # 54 Meurthe et Moselle
                            department = text

                        elif text.isalpha() or " " in text:  # Lorraine, Île-de-France
                            region = text

                    results.append({
                        "title": titre_tag.get_text(strip=True),
                        "price": self.clean_price(prix_tag.get_text(strip=True)) if prix_tag else None,
                        "description": description,
                        "url": lien,
                        "source": self.name,
                        "city": city,
                        "department": department,
                        "region": region,
                    })

                    logger.info(titre_tag.get_text(strip=True))

                    time.sleep(1)                
                

                time.sleep(1)

            browser.close()

        return results