import { describe, expect, test } from "bun:test";

describe("dist import", () => {
  test("exports createTipplyClient from built ESM bundle", async () => {
    // @ts-ignore The test intentionally imports built JavaScript artifacts.
    const sdk = await import("../../dist/index.js");
    expect(typeof sdk.createTipplyClient).toBe("function");
  });

  test("exports createTipplyPublicClient from built public subpath bundle", async () => {
    // @ts-ignore The test intentionally imports built JavaScript artifacts.
    const sdk = await import("../../dist/public.js");
    expect(typeof sdk.createTipplyPublicClient).toBe("function");
  });
});
