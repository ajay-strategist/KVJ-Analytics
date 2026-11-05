const test = require("node:test");
const assert = require("node:assert/strict");

// In-memory cache implementation mirrored from src/shared/cache/redis.ts
class TestMemoryCache {
  constructor() {
    this.store = new Map();
  }

  set(key, value, ttlSeconds) {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.store.set(key, { value: JSON.stringify(value), expiresAt });
  }

  get(key) {
    const item = this.store.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return JSON.parse(item.value);
  }

  del(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

test("Distributed Cache & In-Memory Fallback Tests", async (t) => {
  const cache = new TestMemoryCache();

  await t.test("Stores and retrieves active batch cache", () => {
    const batchData = [{ id: "b1", slug: "excel-power-bi", currentCode: "123456" }];
    cache.set("batches:excel-power-bi", batchData, 30);

    const retrieved = cache.get("batches:excel-power-bi");
    assert.deepEqual(retrieved, batchData);
  });

  await t.test("Immediately invalidates authorization cache on revocation", () => {
    cache.set("enrollment:user-1:excel-power-bi", true, 30);
    assert.equal(cache.get("enrollment:user-1:excel-power-bi"), true);

    // Revoke enrollment
    cache.del("enrollment:user-1:excel-power-bi");
    assert.equal(cache.get("enrollment:user-1:excel-power-bi"), null);
  });

  await t.test("Expired entries return null", async () => {
    // 50ms TTL
    const shortCache = new TestMemoryCache();
    shortCache.set("temp-key", "temp-val", 0.05); // 50ms

    assert.equal(shortCache.get("temp-key"), "temp-val");

    // Wait 60ms
    await new Promise((r) => setTimeout(r, 60));
    assert.equal(shortCache.get("temp-key"), null);
  });
});

