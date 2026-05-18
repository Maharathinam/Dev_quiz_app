const request = require("supertest");
const app = require("../server");

describe("Health Check", () => {
  test("GET /health returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("Questions API", () => {
  test("GET /api/questions returns question list", async () => {
    const res = await request(app).get("/api/questions");
    expect(res.statusCode).toBe(200);
    expect(res.body.questions).toBeDefined();
    expect(res.body.questions.length).toBeGreaterThan(0);
  });

  test("GET /api/questions does not expose answers", async () => {
    const res = await request(app).get("/api/questions");
    res.body.questions.forEach((q) => {
      expect(q.answer).toBeUndefined();
    });
  });

  test("GET /api/questions?category=Docker filters correctly", async () => {
    const res = await request(app).get("/api/questions?category=Docker");
    expect(res.statusCode).toBe(200);
    res.body.questions.forEach((q) => {
      expect(q.category).toBe("Docker");
    });
  });

  test("GET /api/questions/:id returns single question", async () => {
    const res = await request(app).get("/api/questions/1");
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(1);
  });

  test("GET /api/questions/999 returns 404", async () => {
    const res = await request(app).get("/api/questions/999");
    expect(res.statusCode).toBe(404);
  });
});

describe("Submit API", () => {
  test("POST /api/submit with correct answer returns correct: true", async () => {
    const res = await request(app)
      .post("/api/submit")
      .send({ questionId: 1, selectedOption: 0 });
    expect(res.statusCode).toBe(200);
    expect(res.body.correct).toBe(true);
    expect(res.body.explanation).toBeDefined();
  });

  test("POST /api/submit with wrong answer returns correct: false", async () => {
    const res = await request(app)
      .post("/api/submit")
      .send({ questionId: 1, selectedOption: 2 });
    expect(res.statusCode).toBe(200);
    expect(res.body.correct).toBe(false);
  });
});

describe("Categories API", () => {
  test("GET /api/categories returns array of categories", async () => {
    const res = await request(app).get("/api/categories");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.categories)).toBe(true);
  });
});