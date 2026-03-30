import io from "socket.io-client";

import type { UserId } from "../domain/ids";

interface CommandSocketLike {
  connected: boolean;
  emit(event: string, ...args: any[]): this;
  on(event: string, listener: (...args: any[]) => void): this;
  off(event: string, listener?: (...args: any[]) => void): this;
  connect(): this;
  disconnect(): this;
}

interface CommandSocketOptions {
  autoConnect: boolean;
  path: string;
  reconnection: boolean;
  timeout: number;
  transports: string[];
  transportOptions?: {
    websocket: {
      extraHeaders?: Record<string, string>;
    };
  };
}

type CommandSocketFactory = (url: string, options: CommandSocketOptions) => CommandSocketLike;

interface TipAlertCommandTransportOptions {
  authCookie?: string;
  appOrigin: string;
  cookieName: string;
  timeoutMs?: number;
}

function createDefaultSocket(url: string, options: CommandSocketOptions): CommandSocketLike {
  return io(url, options) as CommandSocketLike;
}

function toError(error: unknown, fallbackMessage: string): Error {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === "string") {
    return new Error(error);
  }

  return new Error(fallbackMessage);
}

function buildExtraHeaders(options: TipAlertCommandTransportOptions): Record<string, string> | undefined {
  const headers: Record<string, string> = {
    Origin: options.appOrigin,
    Referer: `${options.appOrigin}/`,
  };

  if (options.authCookie) {
    headers.Cookie = `${options.cookieName}=${options.authCookie}`;
  }

  return Object.keys(headers).length > 0 ? headers : undefined;
}

export class TipAlertCommandClient {
  private readonly socketFactory: CommandSocketFactory;
  private readonly transportOptions: TipAlertCommandTransportOptions;

  constructor(
    private readonly userId: UserId,
    private readonly socketBaseUrl: string,
    transportOptions: TipAlertCommandTransportOptions,
    socketFactory: CommandSocketFactory = createDefaultSocket,
  ) {
    this.transportOptions = transportOptions;
    this.socketFactory = socketFactory;
  }

  skipCurrent(): Promise<void> {
    const timeoutMs = this.transportOptions.timeoutMs ?? 5_000;
    const extraHeaders = buildExtraHeaders(this.transportOptions);

    return new Promise<void>((resolve, reject) => {
      const socket = this.socketFactory(this.socketBaseUrl, {
        autoConnect: false,
        path: "/socket.io",
        reconnection: false,
        timeout: timeoutMs,
        transports: ["websocket"],
        ...(extraHeaders
          ? {
              transportOptions: {
                websocket: {
                  extraHeaders,
                },
              },
            }
          : {}),
      });

      let settled = false;
      let settleTimer: ReturnType<typeof setTimeout> | null = null;
      let timeoutHandle: ReturnType<typeof setTimeout> | null = setTimeout(() => {
        fail(new Error(`Timed out after ${timeoutMs}ms while sending tip alert command.`));
      }, timeoutMs);

      const cleanup = () => {
        if (settleTimer) {
          clearTimeout(settleTimer);
          settleTimer = null;
        }

        if (timeoutHandle) {
          clearTimeout(timeoutHandle);
          timeoutHandle = null;
        }

        socket.off("connect", handleConnect);
        socket.off("connect_error", handleConnectError);
        socket.off("error", handleSocketError);
        socket.disconnect();
      };

      const succeed = () => {
        if (settled) {
          return;
        }

        settled = true;
        cleanup();
        resolve();
      };

      const fail = (error: Error) => {
        if (settled) {
          return;
        }

        settled = true;
        cleanup();
        reject(error);
      };

      const handleConnect = () => {
        try {
          socket.emit("commands", this.userId, { command: "skipMessage" }, () => {
            succeed();
          });

          settleTimer = setTimeout(() => {
            succeed();
          }, 50);
        } catch (error) {
          fail(toError(error, "Failed to send tip alert command."));
        }
      };

      const handleConnectError = (error: unknown) => {
        fail(toError(error, "Tip alert command socket connection failed."));
      };

      const handleSocketError = (error: unknown) => {
        fail(toError(error, "Tip alert command socket failed."));
      };

      socket.on("connect", handleConnect);
      socket.on("connect_error", handleConnectError);
      socket.on("error", handleSocketError);
      socket.connect();
    });
  }
}
