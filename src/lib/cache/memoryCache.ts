type CacheEntry<T> = {
    data: T;
    expiresAt: number;
};

class MemoryCache {
    private cache = new Map<string, CacheEntry<unknown>>();

    set<T>(key: string, data: T, ttl: number): void {
        this.cache.set(key, {
            data,
            expiresAt: Date.now() + ttl,
        });
    }

    get<T>(key: string): T | null {
        const entry = this.cache.get(key);

        if (!entry) {
            return null;
        }

        if (Date.now() >= entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    delete(key: string): void {
        this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }
}

const memoryCache = new MemoryCache();

export default memoryCache;
