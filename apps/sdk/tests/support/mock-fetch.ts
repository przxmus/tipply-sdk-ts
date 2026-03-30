import { expect } from "bun:test";

export interface CapturedRequest {
  method: string;
  url: URL;
  headers: Headers;
  body: unknown;
  credentials: RequestCredentials | undefined;
}

async function parseBody(body: BodyInit | null | undefined): Promise<unknown> {
  if (typeof body !== "string") {
    return undefined;
  }

  if (!body) {
    return undefined;
  }

  return JSON.parse(body);
}

export function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: {
      "content-type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}

export function jsonResponseWithAuthCookie(body: unknown, authCookie: string, init: ResponseInit = {}): Response {
  return jsonResponse(body, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      "set-cookie": `auth_token=${authCookie}; Path=/; HttpOnly`,
    },
  });
}

export function emptyResponse(status = 204): Response {
  return new Response(null, { status });
}

export function createMockFetch(
  handler: (request: CapturedRequest) => Response | Promise<Response>,
): { fetch: typeof fetch; requests: CapturedRequest[] } {
  const requests: CapturedRequest[] = [];

  const fetchImpl: typeof fetch = async (input, init) => {
    const request = new Request(input, init);
    const capturedRequest: CapturedRequest = {
      method: request.method,
      url: new URL(request.url),
      headers: new Headers(request.headers),
      body: await parseBody(init?.body),
      credentials: init?.credentials,
    };

    requests.push(capturedRequest);
    return handler(capturedRequest);
  };

  return {
    fetch: fetchImpl,
    requests,
  };
}

export function expectAuthCookie(headers: Headers, cookieValue: string, cookieName = "auth_token"): void {
  expect(headers.get("cookie")).toBe(`${cookieName}=${cookieValue}`);
}
