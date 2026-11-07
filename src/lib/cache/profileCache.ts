
import memoryCache from "./memoryCache";

const PROFILE_CACHE_TTL = 30 * 1000; // 30 seconds

const pendingRequests = new Map<string, Promise<unknown>>();

const getProfileCacheKey = (userId: string | null): string | null => {
    if (!userId) return null;

    return `current_user_profile_${userId}`;
};

export const getCurrentUserProfile = <T,>(
    userId: string | null
): T | null => {
    const key = getProfileCacheKey(userId);

    if (!key) return null;

    return memoryCache.get<T>(key);
};

export const setCurrentUserProfile = <T,>(
    userId: string | null,
    profile: T
): void => {
    const key = getProfileCacheKey(userId);

    if (!key) return;

    memoryCache.set(key, profile, PROFILE_CACHE_TTL);
};

export const getOrFetchCurrentUserProfile = async <T,>(
    userId: string | null,
    fetcher: () => Promise<T>
): Promise<T> => {
    const key = getProfileCacheKey(userId);

    // Without user ID, fetch normally without caching.
    if (!key) {
        return fetcher();
    }

    // Return cached profile if available.
    const cachedProfile = memoryCache.get<T>(key);

    if (cachedProfile !== null) {
        return cachedProfile;
    }

    // Reuse an already pending request for this user.
    const pendingRequest = pendingRequests.get(key) as Promise<T> | undefined;

    if (pendingRequest) {
        return pendingRequest;
    }

    // Start a new request.
    const request = fetcher()
        .then((profile) => {
            memoryCache.set(key, profile, PROFILE_CACHE_TTL);
            return profile;
        })
        .finally(() => {
            pendingRequests.delete(key);
        });

    pendingRequests.set(key, request);

    return request;
};

export const clearCurrentUserProfile = (userId: string | null): void => {
    const key = getProfileCacheKey(userId);

    if (!key) return;

    memoryCache.delete(key);
};
