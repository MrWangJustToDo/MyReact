type Listener = (...args: any[]) => void;

export class EventEmitter {
  private _events: Map<string | symbol, Listener[]> = new Map();

  on(event: string | symbol, listener: Listener): this {
    const listeners = this._events.get(event) ?? [];
    listeners.push(listener);
    this._events.set(event, listeners);
    return this;
  }

  addListener(event: string | symbol, listener: Listener): this {
    return this.on(event, listener);
  }

  once(event: string | symbol, listener: Listener): this {
    const wrapper = (...args: any[]) => {
      this.off(event, wrapper);
      listener(...args);
    };
    return this.on(event, wrapper);
  }

  off(event: string | symbol, listener: Listener): this {
    const listeners = this._events.get(event);
    if (listeners) {
      this._events.set(
        event,
        listeners.filter((l) => l !== listener)
      );
    }
    return this;
  }

  removeListener(event: string | symbol, listener: Listener): this {
    return this.off(event, listener);
  }

  removeAllListeners(event?: string | symbol): this {
    if (event) {
      this._events.delete(event);
    } else {
      this._events.clear();
    }
    return this;
  }

  emit(event: string | symbol, ...args: any[]): boolean {
    const listeners = this._events.get(event);
    if (!listeners || listeners.length === 0) return false;
    for (const listener of [...listeners]) {
      listener(...args);
    }
    return true;
  }

  listenerCount(event: string | symbol): number {
    return this._events.get(event)?.length ?? 0;
  }

  listeners(event: string | symbol): Listener[] {
    const listeners = this._events.get(event);
    return listeners ? [...listeners] : [];
  }

  rawListeners(event: string | symbol): Listener[] {
    return this.listeners(event);
  }

  eventNames(): (string | symbol)[] {
    return Array.from(this._events.keys());
  }

  setMaxListeners(_n: number): this {
    return this;
  }

  getMaxListeners(): number {
    return Infinity;
  }

  prependListener(event: string | symbol, listener: Listener): this {
    const listeners = this._events.get(event) ?? [];
    listeners.unshift(listener);
    this._events.set(event, listeners);
    return this;
  }

  prependOnceListener(event: string | symbol, listener: Listener): this {
    const wrapper = (...args: any[]) => {
      this.off(event, wrapper);
      listener(...args);
    };
    return this.prependListener(event, wrapper);
  }
}
