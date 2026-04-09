docker compose down -v
docker compose build --no-cache
docker compose up
docker compose up --build -d
docker compose build api
docker compose up --build -d api

docker compose run scraper sh
docker compose run test python main.py
docker compose run --rm --remove-orphans test python main.py

docker exec -it tabac_db psql -U tabac_user -d scraper-tabac -c "\x on" -c "SELECT * FROM listings ORDER BY id DESC LIMIT 10 ;"

docker compose restart

curl -4 ifconfig.me