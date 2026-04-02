from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import time
from urllib.parse import urlparse
from scraper.logger import logger


# BASE_URL = "https://www.huarenjiewang.com/"
BASE_URL = "http://96.126.99.177/"
# Cloudflare : 104.21.19.251
# censys : http://96.126.99.177/


class HuarenjieScraper:
    name = "huarenjie"

    def clean_price(self, prix):
        if not prix:
            return None
        prix = prix.replace("\xa0", " ").replace("€", "")
        prix = prix.replace("价格：", "").replace("Prix :", "")
        return prix.strip()    

    def scrape(self):
        results = []

        with sync_playwright() as p:

            browser = p.chromium.launch(
                headless=True,
                args=[
                    "--no-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-blink-features=AutomationControlled"
                ]
            )        

            page = browser.new_page()

            for i in range(1, 2):

                logger.info(f"📄 Scraping page {i}...")
                # maj page

                url = f"{BASE_URL}city/faguo/category-catid-37-fr_type_dp-2-page-{i}.html"
                #url = BASE_URL
                page.goto(url, wait_until="domcontentloaded")

                page.wait_for_timeout(2000)

                if "Just a moment" in page.content() or "Performing security verification" in page.content():
                    #print("❌ Still blocked by Cloudflare")
                    logger.error("Blocked by Cloudflare")

                try:
                    page.wait_for_selector("ul.shenghuo-list", timeout=5000)
                except:
                    page.wait_for_timeout(5000)
                
                
                html = page.content()
                #print(html)
                soup = BeautifulSoup(html, "html.parser")

                ad_list = soup.select("ul.shenghuo-list li a.shenghuo-item-link")

                for ad in ad_list:
                    #tag = ad.select_one("a.shenghuo-item-link")
                    title = ad.get_text(strip=True)
                    parsed = urlparse(ad['href'])
                    link = BASE_URL + parsed.path

                    # Recuperer la description complète
                    page.goto(link,timeout=5000)
                    detail_html = page.content()
                    detail_soup = BeautifulSoup(detail_html, "html.parser")

                    maincon = detail_soup.select_one("div.maincon")
                    description = maincon.get_text(strip=True)

                    contact = detail_soup.select("div.contact li")
                    price = self.clean_price(contact[2].get_text(strip=True))
                    '''
                    print(title)
                    print(ad['href'])
                    print(price)
                    #print(description[0:100])
                    '''
                    results.append({
                        "title":title,
                        "price": price,
                        "description":description,
                        "url":ad['href'],
                        "source":self.name
                    })

                    logger.info(title)

                    time.sleep(1)

            browser.close()
            return results
