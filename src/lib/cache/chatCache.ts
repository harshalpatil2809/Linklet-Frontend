const pendingRequests = new Map<string, Promise<unknown>>();

export const getOrFetchMutualChats = async <T>(
    userId: string | null,
    fetcher: () => Promise<T>,
): Promise<T> => {
    if (!userId) {
        return fetcher();
    }

    const key = `mutual_chats_${userId}`;

    const pendingRequest = pendingRequests.get(key) as Promise<T> | undefined;

    if (pendingRequest) {
        return pendingRequest;
    }

    const request = fetcher().finally(() => {
        pendingRequests.delete(key);
    });

    pendingRequests.set(key, request);

    return request;
};
