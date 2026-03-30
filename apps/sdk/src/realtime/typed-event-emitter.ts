type EventMap = Record<string, (...args: any[]) => void>;

type ListenerSet<TEvents extends EventMap, TEvent extends keyof TEvents> = Set<TEvents[TEvent]>;

export class TypedEventEmitter<TEvents extends EventMap> {
  private readonly listeners = new Map<keyof TEvents, Set<TEvents[keyof TEvents]>>();

  on<TEvent extends keyof TEvents>(event: TEvent, listener: TEvents[TEvent]): this {
    this.getListeners(event).add(listener);
    return this;
  }

  once<TEvent extends keyof TEvents>(event: TEvent, listener: TEvents[TEvent]): this {
    const onceListener = ((...args: Parameters<TEvents[TEvent]>) => {
      this.off(event, onceListener as TEvents[TEvent]);
      listener(...args);
    }) as TEvents[TEvent];

    return this.on(event, onceListener);
  }

  off<TEvent extends keyof TEvents>(event: TEvent, listener: TEvents[TEvent]): this {
    const listeners = this.listeners.get(event);

    if (!listeners) {
      return this;
    }

    listeners.delete(listener);

    if (listeners.size === 0) {
      this.listeners.delete(event);
    }

    return this;
  }

  removeAllListeners<TEvent extends keyof TEvents>(event?: TEvent): this {
    if (event === undefined) {
      this.listeners.clear();
      return this;
    }

    this.listeners.delete(event);
    return this;
  }

  listenerCount<TEvent extends keyof TEvents>(event: TEvent): number {
    return this.listeners.get(event)?.size ?? 0;
  }

  protected emit<TEvent extends keyof TEvents>(event: TEvent, ...args: Parameters<TEvents[TEvent]>): boolean {
    const listeners = this.listeners.get(event);

    if (!listeners || listeners.size === 0) {
      return false;
    }

    for (const listener of [...listeners] as TEvents[TEvent][]) {
      listener(...args);
    }

    return true;
  }

  private getListeners<TEvent extends keyof TEvents>(event: TEvent): ListenerSet<TEvents, TEvent> {
    const existing = this.listeners.get(event);

    if (existing) {
      return existing as ListenerSet<TEvents, TEvent>;
    }

    const created: ListenerSet<TEvents, TEvent> = new Set();
    this.listeners.set(event, created as Set<TEvents[keyof TEvents]>);
    return created;
  }
}
