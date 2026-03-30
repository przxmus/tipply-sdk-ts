import { describe, expect, test } from "bun:test";

describe("dist import", () => {
  test("exports TipplyClient from built ESM bundle", async () => {
    // @ts-ignore The test intentionally imports the built JavaScript artifact.
    const sdk = await import("../../dist/index.js");
    expect(typeof sdk.TipplyClient).toBe("function");
  });
});
