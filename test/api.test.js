// test/api.test.js — HTTP through supertest, no port bound. /api/sum is RED
// on purpose until s3: the seeded bug makes it return { result: 0 }.
import { describe, expect, test } from "@jest/globals";

import request from "supertest";

import { app } from "../src/index.js";

describe("trackme api", () => {
  test("GET /health answers ok", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  test("GET /api/sum?a=2&b=2 returns result 4", async () => {
    const res = await request(app).get("/api/sum?a=2&b=2");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ result: 4 });
  });
});
