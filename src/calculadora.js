// src/calculadora.js — pure helpers, no I/O: the easiest code to unit-test.

// SEEDED FAILURE 1 of 2 (lint): `os` is imported but never used.
// ESLint flags it with no-unused-vars. Fixed LIVE in section 3 of the guide.
import os from "node:os";

// SEEDED FAILURE 2 of 2 (tests): should be `a + b`. Wrong operator:
// sum(2, 2) returns 0, so the test suite goes RED. Fixed LIVE in section 3.
export function sum(a, b) {
  return a - b;
}

export function mul(a, b) {
  return a * b;
}

export function avg(list) {
  return list.reduce((acc, n) => acc + n, 0) / list.length;
}
