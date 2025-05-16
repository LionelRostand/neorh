
type CachedAllocation<T> = {
  data: T;
  timestamp: number;
};

// TTL = 60 seconds by default
export class AllocationCache<T> {
  private cache: Record<string, CachedAllocation<T>> = {};
  private readonly cacheTtl: number;

  constructor(ttlMs = 60000) {
    this.cacheTtl = ttlMs;
  }

  get(key: string): T | null {
    const now = Date.now();
    const cachedItem = this.cache[key];

    if (cachedItem && now - cachedItem.timestamp < this.cacheTtl) {
      return cachedItem.data;
    }

    return null;
  }

  set(key: string, data: T): void {
    this.cache[key] = {
      data,
      timestamp: Date.now()
    };
  }

  clear(key?: string): void {
    if (key) {
      delete this.cache[key];
    } else {
      this.cache = {};
    }
  }
}

// Create and export a singleton cache instance for allocations
export const allocationCache = new AllocationCache();
