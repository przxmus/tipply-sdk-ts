import { describe, expect, test } from "bun:test";

describe("dist import", () => {
  test("exports TipplyClient from built ESM bundle", async () => {
    // @ts-expect-error This test intentionally loads the built artifact, not the source module.
    const sdk = await import("../../dist/index.js");
    expect(typeof sdk.TipplyClient).toBe("function");
  });
});
