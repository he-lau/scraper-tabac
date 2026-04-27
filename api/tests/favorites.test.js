const request = require("supertest");
const app = require("../app");
const db = require("../db");

afterAll(() => db.end());

let token;
let listingId;

beforeAll(async () => {
  // Créer un user et récupérer le token
  const email = `fav_${Date.now()}@jest.com`;
  await request(app).post("/api/auth/register").send({ email, password: "password123" });
  const login = await request(app).post("/api/auth/login").send({ email, password: "password123" });
  token = login.body.token;

  // Insérer un listing de test
  const res = await db.query(`
    INSERT INTO listings (title, price, city, source, fingerprint)
    VALUES ('Listing favori test', 80000, 'Lyon', 'manual', 'test-fav-listing')
    ON CONFLICT (fingerprint) DO UPDATE SET title = EXCLUDED.title
    RETURNING id
  `);
  listingId = res.rows[0].id;
});

describe("GET /api/favorites", () => {
  it("200 — retourne les favoris (vide)", async () => {
    const res = await request(app).get("/api/favorites").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("401 — sans token", async () => {
    const res = await request(app).get("/api/favorites");
    expect(res.status).toBe(401);
  });
});

describe("POST /api/favorites/:id", () => {
  it("201 — ajoute un favori", async () => {
    const res = await request(app)
      .post(`/api/favorites/${listingId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(201);
  });

  it("409 — déjà en favoris", async () => {
    const res = await request(app)
      .post(`/api/favorites/${listingId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(409);
  });

  it("404 — listing inexistant", async () => {
    const res = await request(app)
      .post("/api/favorites/999999")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it("401 — sans token", async () => {
    const res = await request(app).post(`/api/favorites/${listingId}`);
    expect(res.status).toBe(401);
  });
});

describe("DELETE /api/favorites/:id", () => {
  it("204 — supprime un favori", async () => {
    const res = await request(app)
      .delete(`/api/favorites/${listingId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(204);
  });

  it("404 — favori inexistant", async () => {
    const res = await request(app)
      .delete(`/api/favorites/${listingId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it("401 — sans token", async () => {
    const res = await request(app).delete(`/api/favorites/${listingId}`);
    expect(res.status).toBe(401);
  });
});
