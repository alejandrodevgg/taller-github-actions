// test/calculadora.test.js — the unit suite. sum() is RED on purpose (s3).
import { describe, expect, test } from "@jest/globals";

import { avg, mul, sum } from "../src/calculadora.js";

describe("calculadora", () => {
  test("sum(2, 2) is 4", () => {
    expect(sum(2, 2)).toBe(4);
  });

  test("mul(3, 4) is 12", () => {
    expect(mul(3, 4)).toBe(12);
  });

  test("avg of [2, 4, 6] is 4", () => {
    expect(avg([2, 4, 6])).toBe(4);
  });
});
