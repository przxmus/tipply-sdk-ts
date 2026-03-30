import { describe, expect, test } from "bun:test";

import { TipplyAuthError, TipplyClient } from "../../src";
import {
  currentUserFixture,
  publicGoalConfigurationFixture,
  publicGoalTemplatesFixture,
  publicGoalWidgetFixture,
  publicVotingTemplatesFixture,
} from "../fixtures/sanitized";
import { createMockFetch, emptyResponse, expectAuthCookie, jsonResponse } from "../support/mock-fetch";

describe("http transport", () => {
  test("adds auth cookie only for private endpoints", async () => {
    const { fetch, requests } = createMockFetch((request) => {
      if (request.url.pathname === "/user") {
        return jsonResponse(currentUserFixture);
      }

      if (request.url.pathname === "/api/widgetmessage/user-123") {
        return jsonResponse(true);
      }

      throw new Error(`Unhandled request: ${request.method} ${request.url.pathname}`);
    });

    const client = new TipplyClient({ authCookie: "cookie-123", fetch });

    await client.identity.getCurrentUser();
    await client.public.getWidgetMessage("user-123");

    expectAuthCookie(requests[0]!.headers, "cookie-123");
    expect(requests[0]!.headers.get("referer")).toBe("https://app.tipply.pl/");
    expect(requests[0]!.credentials).toBe("include");
    expect(requests[1]!.headers.get("cookie")).toBeNull();
    expect(requests[1]!.credentials).toBeUndefined();
  });

  test("prefers explicit auth cookie over async cookie provider", async () => {
    let providerCalls = 0;
    const { fetch, requests } = createMockFetch(() => jsonResponse(currentUserFixture));
    const client = new TipplyClient({
      authCookie: "static-cookie",
      getAuthCookie: async () => {
        providerCalls += 1;
        return "async-cookie";
      },
      fetch,
    });

    await client.identity.getCurrentUser();

    expect(providerCalls).toBe(0);
    expectAuthCookie(requests[0]!.headers, "static-cookie");
  });

  test("uses async cookie provider when no static auth cookie is configured", async () => {
    const { fetch, requests } = createMockFetch(() => jsonResponse(currentUserFixture));
    const client = new TipplyClient({
      getAuthCookie: async () => "async-cookie",
      fetch,
    });

    await client.identity.getCurrentUser();

    expectAuthCookie(requests[0]!.headers, "async-cookie");
  });

  test("supports browser-style credentialed requests without manually injecting a cookie header", async () => {
    const { fetch, requests } = createMockFetch(() => jsonResponse(currentUserFixture));
    const client = new TipplyClient({
      includeCredentials: true,
      fetch,
    });

    await client.identity.getCurrentUser();

    expect(requests[0]!.headers.get("cookie")).toBeNull();
    expect(requests[0]!.credentials).toBe("include");
  });

  test("maps oauth failures to TipplyAuthError", async () => {
    const { fetch } = createMockFetch(() =>
      jsonResponse(
        {
          error: "access_denied",
          error_description: "OAuth2 authentication required",
        },
        { status: 401 },
      ),
    );

    const client = new TipplyClient({ authCookie: "bad-cookie", fetch });

    await expect(client.identity.getCurrentUser()).rejects.toBeInstanceOf(TipplyAuthError);
  });

  test("serializes repeated status query params for withdrawals", async () => {
    const { fetch, requests } = createMockFetch(() => jsonResponse([]));
    const client = new TipplyClient({ authCookie: "cookie-123", fetch });

    await client.withdrawals.list({
      statuses: ["ACCEPTED", "TRANSFERRED"],
      limit: 20,
      offset: 0,
    });

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

    const client = new TipplyClient({ authCookie: "cookie-123", fetch });

    await expect(client.profile.hasPendingChanges()).resolves.toBe(false);
  });

  test("allows reading public endpoints with response validation enabled", async () => {
    const { fetch } = createMockFetch((request) => {
      if (request.url.pathname === "/api/templates/TIPS_GOAL/user-123") {
        return jsonResponse(publicGoalTemplatesFixture);
      }

      if (request.url.pathname === "/api/configuration/TIPS_GOAL/user-123") {
        return jsonResponse(publicGoalConfigurationFixture);
      }

      if (request.url.pathname === "/api/widget/goal/goal-123/user-123") {
        return jsonResponse(publicGoalWidgetFixture);
      }

      if (request.url.pathname === "/api/templates/GOAL_VOTING/user-123") {
        return jsonResponse(publicVotingTemplatesFixture);
      }

      throw new Error(`Unhandled request: ${request.method} ${request.url.pathname}`);
    });

    const client = new TipplyClient({ fetch, validateResponses: true });

    await expect(client.public.getGoalTemplates("user-123")).resolves.toHaveLength(1);
    await expect(client.public.getGoalConfiguration("user-123")).resolves.toEqual(publicGoalConfigurationFixture);
    await expect(client.public.getGoalWidget("goal-123", "user-123")).resolves.toEqual(publicGoalWidgetFixture);
    await expect(client.public.getVotingTemplates("user-123")).resolves.toHaveLength(1);
  });

  test("sets origin for non-GET authenticated requests", async () => {
    const { fetch, requests } = createMockFetch(() => emptyResponse(204));
    const client = new TipplyClient({ authCookie: "cookie-123", fetch });

    await client.tips.toggleMessageAudio();

    expect(requests[0]!.headers.get("origin")).toBe("https://app.tipply.pl");
    expect(requests[0]!.headers.get("referer")).toBe("https://app.tipply.pl/");
  });
});
