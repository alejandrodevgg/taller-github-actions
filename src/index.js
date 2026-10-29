// src/index.js — the Express app: /health, /api/sum and the static web/.
import path from "node:path";
import { fileURLToPath } from "node:url";

import express from "express";

import { sum } from "./calculadora.js";

const app = express();
const here = path.dirname(fileURLToPath(import.meta.url));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/sum", (req, res) => {
  const a = Number(req.query.a ?? 0);
  const b = Number(req.query.b ?? 0);
  res.json({ result: sum(a, b) });
});

app.use(express.static(path.join(here, "..", "web")));

// Jest runs with NODE_ENV=test: the suite talks to `app` through supertest,
// so only the real server (npm start / npm run dev) should bind a port.
if (process.env.NODE_ENV !== "test") {
  const port = Number(process.env.PORT ?? 8080);
  app.listen(port, () => {
    console.log(`trackme listening on http://localhost:${port}`);
  });
}

export { app };
