const request = require("supertest");
const app = require("../app");
const db = require("../db");

afterAll(() => db.end());

// Insérer un listing de test avant les tests
beforeAll(async () => {
  await db.query(`
    INSERT INTO listings (title, price, city, source, fingerprint)
    VALUES ('Tabac test', 150000, 'Paris', 'manual', 'test-listing-jest')
    ON CONFLICT (fingerprint) DO NOTHING
  `);
});

describe("GET /api/listings", () => {
  it("200 — retourne une liste", async () => {
    const res = await request(app).get("/api/listings");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("200 — filtre par city", async () => {
    const res = await request(app).get("/api/listings?city=Paris");
    expect(res.status).toBe(200);
    expect(res.body.every((l) => l.city === "Paris")).toBe(true);
  });

  it("400 — limit invalide", async () => {
    const res = await request(app).get("/api/listings?limit=-1");
    expect(res.status).toBe(400);
  });

  it("400 — offset invalide", async () => {
    const res = await request(app).get("/api/listings?offset=-5");
    expect(res.status).toBe(400);
  });

  it("400 — order invalide", async () => {
    const res = await request(app).get("/api/listings?order=INVALID");
    expect(res.status).toBe(400);
  });

  it("400 — orderBy invalide", async () => {
    const res = await request(app).get("/api/listings?orderBy=password");
    expect(res.status).toBe(400);
  });
});

describe("GET /api/listings/:id", () => {
  let listingId;

  beforeAll(async () => {
    const res = await db.query("SELECT id FROM listings WHERE fingerprint = 'test-listing-jest'");
    listingId = res.rows[0].id;
  });

  it("200 — retourne un listing", async () => {
    const res = await request(app).get(`/api/listings/${listingId}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Tabac test");
  });

  it("404 — listing inexistant", async () => {
    const res = await request(app).get("/api/listings/999999");
    expect(res.status).toBe(404);
  });

  it("400 — id invalide", async () => {
    const res = await request(app).get("/api/listings/abc");
    expect(res.status).toBe(400);
  });
});
