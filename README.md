# 🚬 scraper-tabac

Scraper automatisé de cessions de fonds de commerce tabac/bar/brasserie, avec stockage en base de données PostgreSQL et déduplication des annonces.

## 📋 Description

Ce projet collecte automatiquement des annonces de vente de tabacs, FDJ, PMU et brasseries depuis plusieurs sites spécialisés, normalise les données, et les insère dans une base PostgreSQL en évitant les doublons. Le scraper tourne en tâche cron toutes les heures dans un conteneur Docker.

### Sites scrapés

- [cessionpme.com](https://www.cessionpme.com) — annonces filtrées sur les mots-clés `tabac`, `fdj`, `loto`, `pmu`
- [huarenjie.com](https://www.huarenjie.com) — annonces issues de la communauté chinoise

## 🏗️ Architecture

```
scraper-tabac/
├── main.py                  # Point d'entrée — orchestre les scrapers
├── scraper/
│   ├── base_scraper.py      # Classe de base abstraite
│   ├── logger.py            # Configuration Loguru
│   ├── normalize.py         # Normalisation + fingerprint (MD5 de l'URL)
│   └── sites/
│       ├── cessionpme.py    # Scraper Playwright + BeautifulSoup
│       ├── huarenjie.py     # Scraper Playwright + BeautifulSoup
│       └── seloger.py       # (à venir)
├── db/
│   ├── base.py              # Base SQLAlchemy
│   ├── models.py            # Modèle Listing
│   ├── session.py           # SessionLocal
│   └── init_db.py           # Création des tables
├── logs/
│   ├── scraper.log
│   └── cron.log
├── Dockerfile
├── docker-compose.yml
└── crontab                  # Exécution toutes les heures
```

## 🗄️ Modèle de données

Chaque annonce est stockée dans la table `listings` avec les champs suivants :

| Champ | Type | Description |
|---|---|---|
| `id` | Integer | Clé primaire |
| `title` | String | Titre de l'annonce |
| `price` | Float | Prix en euros |
| `city` | String | Ville |
| `department` | String | Département |
| `region` | String | Région |
| `address` | String | Adresse complète |
| `description` | String | Description de l'annonce |
| `url` | String | Lien vers l'annonce originale |
| `fingerprint` | String | Hash MD5 de l'URL (clé d'unicité) |
| `is_active` | Boolean | Annonce encore active |
| `created_at` | DateTime | Date d'insertion |
| `extras` | JSON | Données supplémentaires libres |

## 🚀 Lancement

### Prérequis

- Docker & Docker Compose

### Configuration

Copier et adapter le fichier `.env` :

```env
POSTGRES_USER=tabac_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=scraper-tabac

DATABASE_URL=postgresql://tabac_user:your_password@db:5432/scraper-tabac

PGADMIN_EMAIL=your@email.com
PGADMIN_PASSWORD=your_pgadmin_password
```

> ⚠️ Ne jamais committer le fichier `.env` en production.

### Démarrer les services

```bash
docker compose up -d --build
```

Trois services sont lancés :

| Service | Description | Port |
|---|---|---|
| `db` | PostgreSQL 15 | `5432` |
| `scraper` | Scraper Python + cron | — |
| `pgadmin` | Interface admin BDD | `5050` |

### Accéder à pgAdmin

Ouvrir [http://localhost:5050](http://localhost:5050) et se connecter avec les credentials `PGADMIN_EMAIL` / `PGADMIN_PASSWORD` définis dans `.env`.

### Lancer le scraper manuellement

```bash
docker compose exec scraper python main.py
```

### Voir les logs

```bash
# Logs du scraper
docker compose exec scraper tail -f /app/logs/scraper.log

# Logs du cron
docker compose exec scraper tail -f /app/logs/cron.log
```

## ⏱️ Planification

Le scraper s'exécute automatiquement **toutes les heures** via une tâche cron :

```
0 * * * * root cd /app && python main.py >> /app/logs/cron.log 2>&1
```

## 🛠️ Stack technique

- **Python 3.12**
- **Playwright** — navigation headless (anti-bot)
- **BeautifulSoup4 / lxml** — parsing HTML
- **SQLAlchemy** — ORM
- **PostgreSQL 15** — base de données
- **Loguru** — logs structurés
- **Docker Compose** — orchestration
- **Cron** — planification des tâches

## 📦 Installation locale (sans Docker)

```bash
pip install -r requirements.txt
playwright install chromium --with-deps
```

Puis configurer la variable `DATABASE_URL` dans `.env` et lancer :

```bash
python main.py
```

## 🔧 Ajouter un nouveau scraper

1. Créer un fichier dans `scraper/sites/mon_site.py` héritant de `BaseScraper`
2. Implémenter la méthode `scrape()` qui retourne une liste de dicts
3. Ajouter le scraper dans la liste `SCRAPERS` dans `main.py`

Les clés attendues dans chaque dict : `title`, `price`, `url`, `source`, `city`, `department`, `region`, `description`.
