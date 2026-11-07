const pendingRequests = new Map<string, Promise<unknown>>();

export const getOrFetchNotificationHistory = async <T,>(
    userId: string | null,
    fetcher: () => Promise<T>
): Promise<T> => {
    if (!userId) {
        return fetcher();
    }

    const key = `notification_history_${userId}`;

    const pendingRequest = pendingRequests.get(key) as
        | Promise<T>
        | undefined;

    if (pendingRequest) {
        return pendingRequest;
    }

    const request = fetcher().finally(() => {
        pendingRequests.delete(key);
    });

    pendingRequests.set(key, request);

    return request;
};