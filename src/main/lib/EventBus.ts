type EventCallback<T = unknown> = (data: T) => void;

export interface EventBus {
  on<T>(event: string, callback: EventCallback<T>): void;
  once<T>(event: string, callback: EventCallback<T>): void;
  off(event: string, callback?: EventCallback): void;
  emit<T>(event: string, data: T): void;
  removeAllListeners(event?: string): void;
}

class MainEventBus implements EventBus {
  private listeners = new Map<string, Set<EventCallback>>();

  on<T>(event: string, callback: EventCallback<T>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback as EventCallback);
  }

  once<T>(event: string, callback: EventCallback<T>): void {
    const wrappedCallback = ((data: T) => {
      callback(data);
      this.off(event, wrappedCallback as EventCallback);
    }) as EventCallback;
    this.on(event, wrappedCallback);
  }

  off(event: string, callback?: EventCallback): void {
    if (!callback) {
      this.listeners.delete(event);
      return;
    }
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  emit<T>(event: string, data: T): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event handler for "${event}":`, error);
        }
      });
    }
  }

  removeAllListeners(event?: string): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  listenerCount(event: string): number {
    return this.listeners.get(event)?.size ?? 0;
  }

  eventNames(): string[] {
    return Array.from(this.listeners.keys());
  }
}

export const eventBus = new MainEventBus();
