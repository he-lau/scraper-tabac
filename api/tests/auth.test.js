const request = require("supertest");
const app = require("../app");
const db = require("../db");

afterAll(() => db.end());

const TEST_EMAIL = `test_${Date.now()}@jest.com`;
const TEST_PASSWORD = "password123";
let token;

describe("POST /api/auth/register", () => {
  it("201 — crée un utilisateur", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });
    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe(TEST_EMAIL);
  });

  it("409 — email déjà utilisé", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });
    expect(res.status).toBe(409);
  });

  it("400 — champs manquants", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: TEST_EMAIL });
    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth/login", () => {
  it("200 — retourne un token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it("401 — mauvais mot de passe", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: TEST_EMAIL, password: "wrongpassword" });
    expect(res.status).toBe(401);
  });

  it("401 — email inconnu", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "inconnu@test.com", password: TEST_PASSWORD });
    expect(res.status).toBe(401);
  });
});

describe("GET /api/auth/me", () => {
  it("200 — retourne l'utilisateur connecté", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(TEST_EMAIL);
  });

  it("401 — sans token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("401 — token invalide", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer token_invalide");
    expect(res.status).toBe(401);
  });
});
