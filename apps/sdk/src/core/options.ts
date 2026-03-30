import type { FetchLike, MaybePromise, TipplyAuthLifecycleOptions, TipplyClientOptions, TipplySessionOptions, TipplyTransportOptions } from "./types";

export interface ResolvedTipplyClientOptions {
  session: TipplySessionOptions | undefined;
  auth: ResolvedTipplyAuthLifecycleOptions;
  transport: ResolvedTipplyTransportOptions;
  validation: boolean;
}

/** Normalized auth lifecycle controls used by the transport layer. */
export interface ResolvedTipplyAuthLifecycleOptions {
  refreshTokenOnRequests: boolean;
  refreshTokenEveryMs: number | undefined;
  reconnectTries: number;
}

export interface ResolvedTipplyTransportOptions {
  fetch: FetchLike;
  proxyBaseUrl: string;
  publicBaseUrl: string;
  alertSocketBaseUrl: string;
  commandsSocketBaseUrl: string;
  appOrigin: string;
  cookieName: string;
  includeCredentials: boolean;
  timeoutMs: number;
}

function normalizeBaseUrl(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function resolveAuthLifecycle(options: TipplyAuthLifecycleOptions | undefined): ResolvedTipplyAuthLifecycleOptions {
  const refreshTokenEvery = options?.refreshTokenEvery;
  let refreshTokenEveryMs: number | undefined;

  if (refreshTokenEvery === true) {
    refreshTokenEveryMs = 300_000;
  } else if (typeof refreshTokenEvery === "object" && refreshTokenEvery !== null) {
    refreshTokenEveryMs = Math.max(1, Math.trunc(refreshTokenEvery.intervalMs ?? 300_000));
  }

  const reconnectTries =
    options?.reconnectTries === false ? 1 : Math.max(1, Math.trunc(options?.reconnectTries ?? 3));

  return {
    refreshTokenOnRequests: options?.refreshTokenOnRequests ?? true,
    refreshTokenEveryMs,
    reconnectTries,
  };
}

function resolveSession(options: TipplyClientOptions): TipplySessionOptions | undefined {
  if (options.session) {
    return options.session;
  }

  if (options.authCookie) {
    return { authCookie: options.authCookie };
  }

  if (options.getAuthCookie) {
    return { getAuthCookie: options.getAuthCookie };
  }

  if (options.includeCredentials) {
    return { browserSession: true };
  }

  return undefined;
}

export function resolveClientOptions(options: TipplyClientOptions = {}): ResolvedTipplyClientOptions {
  const fetchImpl = options.transport?.fetch ?? options.fetch ?? globalThis.fetch;

  if (!fetchImpl) {
    throw new Error("Global fetch is not available. Provide a fetch implementation in TipplyClientOptions.transport.fetch.");
  }

  const transportOptions: TipplyTransportOptions = options.transport ?? {};

  return {
    session: resolveSession(options),
    auth: resolveAuthLifecycle(options.auth),
    transport: {
      fetch: fetchImpl,
      proxyBaseUrl: normalizeBaseUrl(transportOptions.proxyBaseUrl ?? "https://proxy.tipply.pl"),
      publicBaseUrl: normalizeBaseUrl(transportOptions.publicBaseUrl ?? "https://tipply.pl/api"),
      alertSocketBaseUrl: normalizeBaseUrl(transportOptions.alertSocketBaseUrl ?? "https://alert-ws.tipply.pl"),
      commandsSocketBaseUrl: normalizeBaseUrl(transportOptions.commandsSocketBaseUrl ?? "https://ws.tipply.pl"),
      appOrigin: normalizeBaseUrl(transportOptions.appOrigin ?? "https://app.tipply.pl"),
      cookieName: transportOptions.cookieName ?? "auth_token",
      includeCredentials: transportOptions.includeCredentials ?? true,
      timeoutMs: transportOptions.timeoutMs ?? 30_000,
    },
    validation: options.validation ?? options.validateResponses ?? true,
  };
}

export async function resolveSessionCookie(session: TipplySessionOptions | undefined): Promise<string | undefined> {
  if (!session) {
    return undefined;
  }

  if ("authCookie" in session) {
    return session.authCookie;
  }

  if ("getAuthCookie" in session) {
    const authCookie = await (session.getAuthCookie as () => MaybePromise<string | null | undefined>)();
    return authCookie ?? undefined;
  }

  return undefined;
}
