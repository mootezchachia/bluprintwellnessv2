type Callback = (...args: any[]) => void;

class ScrollEventBus {
  private listeners: Map<string, Set<Callback>> = new Map();

  on(event: string, callback: Callback) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: Callback) {
    this.listeners.get(event)?.delete(callback);
  }

  emit(event: string, ...args: any[]) {
    this.listeners.get(event)?.forEach((cb) => cb(...args));
  }
}

export const scrollEvents = new ScrollEventBus();
