type EventListener = (...args: any[]) => void;
type EventKey<TEvents> = Extract<keyof TEvents, string | symbol>;
type EventHandler<TEvents, TEvent extends EventKey<TEvents>> = Extract<TEvents[TEvent], EventListener>;
type ListenerSet<TEvents, TEvent extends EventKey<TEvents>> = Set<EventHandler<TEvents, TEvent>>;

/** Minimal strongly typed event emitter used by realtime listener implementations. */
export class TypedEventEmitter<TEvents extends object> {
  private readonly listeners = new Map<EventKey<TEvents>, Set<EventListener>>();

  /** Registers a listener for the selected event. */
  on<TEvent extends EventKey<TEvents>>(event: TEvent, listener: EventHandler<TEvents, TEvent>): this {
    this.getListeners(event).add(listener);
    return this;
  }

  /** Registers a listener that is removed after its first invocation. */
  once<TEvent extends EventKey<TEvents>>(event: TEvent, listener: EventHandler<TEvents, TEvent>): this {
    const onceListener = ((...args: Parameters<EventHandler<TEvents, TEvent>>) => {
      this.off(event, onceListener as EventHandler<TEvents, TEvent>);
      listener(...args);
    }) as EventHandler<TEvents, TEvent>;

    return this.on(event, onceListener);
  }

  /** Removes a previously registered listener. */
  off<TEvent extends EventKey<TEvents>>(event: TEvent, listener: EventHandler<TEvents, TEvent>): this {
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

  /** Removes every listener, or all listeners for a single event. */
  removeAllListeners<TEvent extends EventKey<TEvents>>(event?: TEvent): this {
    if (event === undefined) {
      this.listeners.clear();
      return this;
    }

    this.listeners.delete(event);
    return this;
  }

  /** Returns the number of listeners currently registered for an event. */
  listenerCount<TEvent extends EventKey<TEvents>>(event: TEvent): number {
    return this.listeners.get(event)?.size ?? 0;
  }

  protected emit<TEvent extends EventKey<TEvents>>(
    event: TEvent,
    ...args: Parameters<EventHandler<TEvents, TEvent>>
  ): boolean {
    const listeners = this.listeners.get(event);

    if (!listeners || listeners.size === 0) {
      return false;
    }

    for (const listener of [...listeners] as EventHandler<TEvents, TEvent>[]) {
      listener(...args);
    }

    return true;
  }

  private getListeners<TEvent extends EventKey<TEvents>>(event: TEvent): ListenerSet<TEvents, TEvent> {
    const existing = this.listeners.get(event);

    if (existing) {
      return existing as ListenerSet<TEvents, TEvent>;
    }

    const created: ListenerSet<TEvents, TEvent> = new Set();
    this.listeners.set(event, created as Set<EventListener>);
    return created;
  }
}
