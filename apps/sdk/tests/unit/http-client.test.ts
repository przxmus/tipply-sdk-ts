import { describe, expect, test } from "bun:test";

import { TipplyAuthenticationError, asGoalId, asUserId, asWithdrawalId, createTipplyClient } from "../../src";
import { createTipplyPublicClient } from "../../src/public";
import {
  currentUserFixture,
  publicGoalConfigurationFixture,
  publicTemplateFontsFixture,
  rawCurrentUserFixture,
  rawPublicGoalConfigurationFixture,
  rawPublicGoalTemplatesFixture,
  rawPublicGoalWidgetFixture,
  rawPublicVotingTemplatesFixture,
} from "../fixtures/sanitized";
import { createMockFetch, emptyResponse, expectAuthCookie, jsonResponse } from "../support/mock-fetch";

describe("http transport", () => {
  test("adds auth cookie only for authenticated endpoints", async () => {
    const { fetch, requests } = createMockFetch((request) => {
      if (request.url.pathname === "/user") {
        return jsonResponse(rawCurrentUserFixture);
      }

      if (request.url.pathname === "/api/widgetmessage/user-123") {
        return jsonResponse(true);
      }

      throw new Error(`Unhandled request: ${request.method} ${request.url.pathname}`);
    });

    const client = createTipplyClient({ authCookie: "cookie-123", fetch });

    await client.me.get();
    await client.public.user(asUserId("user-123")).widgetMessage.get();

    expectAuthCookie(requests[0]!.headers, "cookie-123");
    expect(requests[0]!.headers.get("referer")).toBe("https://app.tipply.pl/");
    expect(requests[0]!.credentials).toBe("include");
    expect(requests[1]!.headers.get("cookie")).toBeNull();
    expect(requests[1]!.credentials).toBeUndefined();
  });

  test("prefers explicit auth cookie over async cookie provider", async () => {
    let providerCalls = 0;
    const { fetch, requests } = createMockFetch(() => jsonResponse(rawCurrentUserFixture));
    const client = createTipplyClient({
      authCookie: "static-cookie",
      getAuthCookie: async () => {
        providerCalls += 1;
        return "async-cookie";
      },
      fetch,
    });

    await client.me.get();

    expect(providerCalls).toBe(0);
    expectAuthCookie(requests[0]!.headers, "static-cookie");
  });

  test("uses async cookie provider when no static auth cookie is configured", async () => {
    const { fetch, requests } = createMockFetch(() => jsonResponse(rawCurrentUserFixture));
    const client = createTipplyClient({
      getAuthCookie: async () => "async-cookie",
      fetch,
    });

    await client.me.get();

    expectAuthCookie(requests[0]!.headers, "async-cookie");
  });

  test("supports browser-style credentialed requests without manual cookie injection", async () => {
    const { fetch, requests } = createMockFetch(() => jsonResponse(rawCurrentUserFixture));
    const client = createTipplyClient({
      session: { browserSession: true },
      transport: { fetch, includeCredentials: true },
    });

    await client.me.get();

    expect(requests[0]!.headers.get("cookie")).toBeNull();
    expect(requests[0]!.credentials).toBe("include");
  });

  test("maps oauth failures to TipplyAuthenticationError", async () => {
    const { fetch } = createMockFetch(() =>
      jsonResponse(
        {
          error: "access_denied",
          error_description: "OAuth2 authentication required",
        },
        { status: 401 },
      ),
    );

    const client = createTipplyClient({ authCookie: "bad-cookie", fetch });

    await expect(client.me.get()).rejects.toBeInstanceOf(TipplyAuthenticationError);
  });

  test("serializes repeated status query params for withdrawals builder", async () => {
    const { fetch, requests } = createMockFetch(() => jsonResponse([]));
    const client = createTipplyClient({ authCookie: "cookie-123", fetch });

    await client.withdrawals.list().status("accepted", "transferred").limit(20).offset(0).get();

    expect(requests[0]!.url.searchParams.getAll("status[]")).toEqual(["ACCEPTED", "TRANSFERRED"]);
    expect(requests[0]!.url.searchParams.get("limit")).toBe("20");
    expect(requests[0]!.url.searchParams.get("offset")).toBe("0");
  });

  test("maps pending profile 204 to false", async () => {
    const { fetch } = createMockFetch((request) => {
      if (request.url.pathname === "/user/profile" && request.url.searchParams.get("pending") === "true") {
        return emptyResponse(204);
      }

      throw new Error(`Unhandled request: ${request.method} ${request.url.pathname}`);
    });

    const client = createTipplyClient({ authCookie: "cookie-123", fetch });

    await expect(client.profile.pendingChanges.check()).resolves.toBe(false);
  });

  test("allows reading public endpoints through the public client", async () => {
    const { fetch } = createMockFetch((request) => {
      if (request.url.pathname === "/api/templates/TIPS_GOAL/user-123") return jsonResponse(rawPublicGoalTemplatesFixture);
      if (request.url.pathname === "/api/configuration/TIPS_GOAL/user-123") return jsonResponse(rawPublicGoalConfigurationFixture);
      if (request.url.pathname === "/api/templatefonts/user-123") {
        return new Response(publicTemplateFontsFixture, {
          status: 200,
          headers: { "content-type": "text/css" },
        });
      }
      if (request.url.pathname === "/api/widget/goal/goal-123/user-123") return jsonResponse(rawPublicGoalWidgetFixture);
      if (request.url.pathname === "/api/templates/GOAL_VOTING/user-123") return jsonResponse(rawPublicVotingTemplatesFixture);

      throw new Error(`Unhandled request: ${request.method} ${request.url.pathname}`);
    });

    const client = createTipplyPublicClient({ transport: { fetch } });
    const user = client.user(asUserId("user-123"));

    await expect(user.goals.templates.list()).resolves.toHaveLength(1);
    await expect(user.goals.configuration.get()).resolves.toEqual(publicGoalConfigurationFixture);
    await expect(user.templateFonts.get()).resolves.toEqual(publicTemplateFontsFixture);
    await expect(user.goals.id(asGoalId("goal-123")).widget.get()).resolves.toBeDefined();
    await expect(user.voting.templates.list()).resolves.toHaveLength(1);
  });

  test("reads binary confirmation pdf responses", async () => {
    const { fetch, requests } = createMockFetch((request) => {
      if (request.url.pathname === "/bank/print-confirmation/withdrawal-123/pdf") {
        return new Response(Uint8Array.from([37, 80, 68, 70]), {
          status: 200,
          headers: { "content-type": "application/pdf" },
        });
      }

      throw new Error(`Unhandled request: ${request.method} ${request.url.pathname}`);
    });

    const client = createTipplyClient({ authCookie: "cookie-123", fetch });
    const result = await client.withdrawals.id(asWithdrawalId("withdrawal-123")).confirmationPdf.get();

    expect(Array.from(new Uint8Array(result))).toEqual([37, 80, 68, 70]);
    expect(requests[0]!.headers.get("accept")).toBe("application/pdf");
    expectAuthCookie(requests[0]!.headers, "cookie-123");
  });

  test("sets origin for non-get authenticated requests", async () => {
    const { fetch, requests } = createMockFetch(() => emptyResponse(204));
    const client = createTipplyClient({ authCookie: "cookie-123", fetch });

    await client.tips.audio.toggle();

    expect(requests[0]!.headers.get("origin")).toBe("https://app.tipply.pl");
    expect(requests[0]!.headers.get("referer")).toBe("https://app.tipply.pl/");
  });

  test("reads current user through the root factory", async () => {
    const { fetch } = createMockFetch(() => jsonResponse(rawCurrentUserFixture));
    const client = createTipplyClient({ authCookie: "cookie-123", fetch });

    await expect(client.me.get()).resolves.toEqual(currentUserFixture);
  });

  test("does not crash on malformed current user payloads", async () => {
    const { fetch } = createMockFetch(() =>
      jsonResponse({
        ...rawCurrentUserFixture,
        minimal_amount_allowed: false,
      }),
    );
    const client = createTipplyClient({ authCookie: "cookie-123", fetch });

    await expect(client.me.get()).resolves.toMatchObject({
      ...currentUserFixture,
      minimalAmountAllowed: 0,
    });
  });
});
