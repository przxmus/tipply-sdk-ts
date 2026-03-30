import io from "socket.io-client";

import type { UserId } from "../domain/ids";
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
