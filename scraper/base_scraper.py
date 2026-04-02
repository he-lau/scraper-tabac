from abc import ABC, abstractmethod
from typing import List, Dict, Any


class BaseScraper(ABC):
    name: str

    @abstractmethod
    def scrape(self) -> List[Dict[str, Any]]:
        """
        Scrape le site et retourne une liste de résultats bruts.
        Chaque dict doit contenir au minimum : title, url, source.
        """
        pass

    def clean_price(self, prix: str) -> str | None:
        """
        Nettoyage basique du prix — peut être surchargé par les sous-classes.
        """
        if not prix:
            return None
        return (prix
            .replace("\xa0", " ")
            .replace("€", "")
            .strip()
        )