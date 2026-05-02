interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  tags: string[];
}

class TtlCache {
  private store = new Map<string, CacheEntry<unknown>>();
  private hitCount = 0;
  private missCount = 0;

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) {
      this.missCount++;
      return null;
    }
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      this.missCount++;
      return null;
    }
    this.hitCount++;
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlMs: number, tags: string[] = []) {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs, tags });
  }

  del(key: string) {
    this.store.delete(key);
  }

  invalidateByTag(tag: string) {
    for (const [key, entry] of this.store.entries()) {
      if (entry.tags.includes(tag)) {
        this.store.delete(key);
      }
    }
  }

  prune() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) this.store.delete(key);
    }
  }

  getStats() {
    return {
      keys: this.store.size,
      hits: this.hitCount,
      misses: this.missCount,
      hitRate:
        this.hitCount + this.missCount > 0
          ? `${((this.hitCount / (this.hitCount + this.missCount)) * 100).toFixed(1)}%`
          : "0.0%",
    };
  }

  clear() {
    this.store.clear();
  }
}

export const cache = new TtlCache();

const PRUNE_INTERVAL_MS = 60_000;
const pruneTimer = setInterval(() => cache.prune(), PRUNE_INTERVAL_MS);
if (typeof pruneTimer.unref === "function") pruneTimer.unref();

export const TTL = {
  PROBLEMS_LIST: 120_000,
  PROBLEM_DETAIL: 300_000,
  LEADERBOARD: 30_000,
  LEADERBOARD_STATS: 30_000,
} as const;

export const TAGS = {
  PROBLEMS: "problems",
  LEADERBOARD: "leaderboard",
} as const;
