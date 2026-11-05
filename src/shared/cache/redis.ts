/**
 * Resilient Distributed & In-Memory Cache Client
 * 
 * Supports Upstash Redis REST API when configured via UPSTASH_REDIS_REST_URL and
 * UPSTASH_REDIS_REST_TOKEN, with automatic, transparent fallback to local in-memory
 * LRU/TTL cache if Redis is unconfigured or unreachable.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const memoryStore = new Map<string, CacheEntry<any>>();
const MAX_MEMORY_KEYS = 5000;

function pruneMemoryStore() {
  if (memoryStore.size <= MAX_MEMORY_KEYS) return;
  const now = Date.now();
  // Evict expired first
  for (const [key, entry] of memoryStore.entries()) {
    if (entry.expiresAt <= now) {
      memoryStore.delete(key);
    }
  }
  // If still too large, evict oldest 20%
  if (memoryStore.size > MAX_MEMORY_KEYS) {
    const keysToDelete = Array.from(memoryStore.keys()).slice(0, Math.floor(MAX_MEMORY_KEYS * 0.2));
    for (const k of keysToDelete) {
      memoryStore.delete(k);
    }
  }
}

function getRedisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/+$/, ""), token };
}

async function callUpstashCommand(command: (string | number)[]): Promise<any> {
  const cfg = getRedisConfig();
  if (!cfg) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5s max timeout for cache operations

  try {
    const res = await fetch(cfg.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return null;
    }
    const json = await res.json();
    return json.result;
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

/**
 * Retrieve an item from cache.
 * Checks Upstash Redis if configured, falling back to local memory.
 */
export async function cacheGet<T = any>(key: string): Promise<T | null> {
  const cfg = getRedisConfig();
  if (cfg) {
    try {
      const raw = await callUpstashCommand(["GET", key]);
      if (raw !== null && raw !== undefined) {
        if (typeof raw === "string") {
          try {
            return JSON.parse(raw) as T;
          } catch {
            return raw as unknown as T;
          }
        }
        return raw as T;
      }
    } catch {
      // Fall through to memoryStore
    }
  }

  // Memory fallback
  const mem = memoryStore.get(key);
  if (!mem) return null;
  if (Date.now() > mem.expiresAt) {
    memoryStore.delete(key);
    return null;
  }
  return mem.value as T;
}

/**
 * Store an item in cache with TTL in seconds.
 */
export async function cacheSet<T = any>(key: string, value: T, ttlSeconds: number = 60): Promise<void> {
  const cfg = getRedisConfig();
  const stringVal = typeof value === "string" ? value : JSON.stringify(value);

  // Store in memory regardless for instant local reads
  pruneMemoryStore();
  memoryStore.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });

  if (cfg) {
    try {
      await callUpstashCommand(["SET", key, stringVal, "EX", ttlSeconds]);
    } catch {
      // Non-blocking; memory store holds the cache locally
    }
  }
}

/**
 * Remove an item from cache.
 */
export async function cacheDel(key: string): Promise<void> {
  memoryStore.delete(key);
  const cfg = getRedisConfig();
  if (cfg) {
    try {
      await callUpstashCommand(["DEL", key]);
    } catch {
      // Ignore
    }
  }
}

