import io from "socket.io-client";

import { asUserId, type UserId } from "../domain/ids";
import { parseTipAlertDonation } from "../domain/alerts-schemas";
import type { TipAlertDonation } from "../domain/alerts";
import { TypedEventEmitter } from "./typed-event-emitter";

interface SocketLike {
  connected: boolean;
  on(event: string, listener: (...args: any[]) => void): this;
  off(event: string, listener?: (...args: any[]) => void): this;
  connect(): this;
  disconnect(): this;
}

type SocketFactory = (url: string, options: { autoConnect: boolean; reconnection: boolean }) => SocketLike;

export interface TipAlertsListenerEvents {
  ready: () => void;
  donation: (donation: TipAlertDonation) => void;
  disconnect: (reason: string) => void;
  error: (error: Error) => void;
}

export interface TipAlertsListenerOptions {
  reconnect?: boolean;
}

export type TipAlertsWidgetUrl = string | URL;

export interface TipAlertsListener {
  readonly userId: UserId;
  readonly connected: boolean;
  connect(): Promise<void>;
  destroy(): void;
  on<E extends keyof TipAlertsListenerEvents>(event: E, listener: TipAlertsListenerEvents[E]): this;
  once<E extends keyof TipAlertsListenerEvents>(event: E, listener: TipAlertsListenerEvents[E]): this;
  off<E extends keyof TipAlertsListenerEvents>(event: E, listener: TipAlertsListenerEvents[E]): this;
  removeAllListeners<E extends keyof TipAlertsListenerEvents>(event?: E): this;
}

function createDefaultSocket(url: string, options: { autoConnect: boolean; reconnection: boolean }): SocketLike {
  return io(url, options) as SocketLike;
}

function toError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === "string") {
    return new Error(error);
  }

  return new Error("Unknown tip alerts socket error.");
}

/**
 * Extracts a {@link UserId} from a `TIP_ALERT` widget URL or widget path.
 *
 * @param widgetUrl - A full widget URL such as `https://widgets.tipply.pl/TIP_ALERT/<userId>` or a raw `/TIP_ALERT/<userId>` path.
 * @returns The parsed Tipply user identifier.
 *
 * @example
 * ```typescript
 * const userId = parseTipAlertsWidgetUrl("https://widgets.tipply.pl/TIP_ALERT/user-123");
 * ```
 *
 * @throws {Error} If the input does not match the expected `TIP_ALERT` widget path shape.
 */
export function parseTipAlertsWidgetUrl(widgetUrl: TipAlertsWidgetUrl): UserId {
  const pathname =
    widgetUrl instanceof URL
      ? widgetUrl.pathname
      : (() => {
          try {
            return new URL(widgetUrl).pathname;
          } catch {
            return widgetUrl;
          }
        })();

  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] !== "TIP_ALERT" || !segments[1]) {
    throw new Error(
      "Invalid TIP_ALERT widget URL. Expected a path like https://widgets.tipply.pl/TIP_ALERT/<userId>.",
    );
  }

  return asUserId(segments[1]);
}

/**
 * Public realtime listener for Tipply `TIP_ALERT` events.
 *
 * The listener stays disconnected until {@link PublicTipAlertsListener.connect}
 * is called.
 */
export class PublicTipAlertsListener
  extends TypedEventEmitter<TipAlertsListenerEvents>
  implements TipAlertsListener
{
  private readonly reconnect: boolean;
  private readonly socketFactory: SocketFactory;
  private socket: SocketLike | null = null;
  private connectPromise: Promise<void> | null = null;
  private resolveConnect: (() => void) | null = null;
  private rejectConnect: ((error: Error) => void) | null = null;
  private destroyed = false;

  constructor(
    readonly userId: UserId,
    private readonly socketBaseUrl: string,
    options: TipAlertsListenerOptions = {},
    socketFactory: SocketFactory = createDefaultSocket,
  ) {
    super();
    this.reconnect = options.reconnect ?? true;
    this.socketFactory = socketFactory;
  }

  get connected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Connects to the `TIP_ALERT` websocket stream.
   *
   * @returns A promise that resolves after the socket fires the `ready` event.
   *
   * @throws {Error} If the listener has already been destroyed.
   * @throws {Error} If the socket fails before the connection handshake completes.
   */
  connect(): Promise<void> {
    if (this.destroyed) {
      return Promise.reject(new Error("Tip alerts listener has been destroyed."));
    }

    if (this.connected) {
      return Promise.resolve();
    }

    if (this.connectPromise) {
      return this.connectPromise;
    }

    const socket = this.getOrCreateSocket();

    this.connectPromise = new Promise<void>((resolve, reject) => {
      this.resolveConnect = resolve;
      this.rejectConnect = reject;
    });

    socket.connect();

    return this.connectPromise;
  }

  /**
   * Disconnects the socket and removes all registered listeners.
   *
   * @returns Nothing.
   */
  destroy(): void {
    this.destroyed = true;
    this.finishConnect(new Error("Tip alerts listener was destroyed before the connection was established."));

    if (this.socket) {
      this.socket.off("connect", this.handleConnect);
      this.socket.off("alert", this.handleAlert);
      this.socket.off("disconnect", this.handleDisconnect);
      this.socket.off("connect_error", this.handleConnectError);
      this.socket.disconnect();
      this.socket = null;
    }

    this.removeAllListeners();
  }

  private getOrCreateSocket(): SocketLike {
    if (this.socket) {
      return this.socket;
    }

    const socket = this.socketFactory(`${this.socketBaseUrl}/${this.userId}`, {
      autoConnect: false,
      reconnection: this.reconnect,
    });

    socket.on("connect", this.handleConnect);
    socket.on("alert", this.handleAlert);
    socket.on("disconnect", this.handleDisconnect);
    socket.on("connect_error", this.handleConnectError);

    this.socket = socket;
    return socket;
  }

  private readonly handleConnect = () => {
    this.emit("ready");
    this.finishConnect();
  };

  private readonly handleAlert = (payload: unknown) => {
    try {
      const donation = parseTipAlertDonation(payload);
      this.emit("donation", donation);
    } catch (error) {
      this.emit("error", toError(error));
    }
  };

  private readonly handleDisconnect = (reason: unknown) => {
    const message = typeof reason === "string" ? reason : "unknown";

    if (!this.connected) {
      this.finishConnect(new Error(`Tip alerts socket disconnected before connecting: ${message}`));
    }

    this.emit("disconnect", message);
  };

  private readonly handleConnectError = (error: unknown) => {
    const normalizedError = toError(error);
    this.finishConnect(normalizedError);
    this.emit("error", normalizedError);
  };

  private finishConnect(error?: Error): void {
    if (error && this.rejectConnect) {
      this.rejectConnect(error);
    } else if (!error && this.resolveConnect) {
      this.resolveConnect();
    }

    this.connectPromise = null;
    this.resolveConnect = null;
    this.rejectConnect = null;
  }
}

/**
 * Creates a public tip alerts listener directly from a widget URL.
 *
 * @param widgetUrl - A full `TIP_ALERT` widget URL or raw widget path.
 * @param socketBaseUrl - The websocket base URL used to connect to Tipply alerts.
 * @param options - Listener configuration such as reconnection behavior.
 * @returns A disconnected {@link TipAlertsListener} ready to be connected.
 *
 * @throws {Error} If {@link widgetUrl} does not contain a valid `TIP_ALERT` user path.
 */
export function createTipAlertsListenerFromWidgetUrl(
  widgetUrl: TipAlertsWidgetUrl,
  socketBaseUrl: string,
  options?: TipAlertsListenerOptions,
): TipAlertsListener {
  return new PublicTipAlertsListener(parseTipAlertsWidgetUrl(widgetUrl), socketBaseUrl, options);
}
