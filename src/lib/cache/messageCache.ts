const pendingRequests = new Map<number, Promise<unknown>>();

export const getOrFetchChatHistory = async <T,>(
    chatId: number,
    fetcher: () => Promise<T>
): Promise<T> => {
    const pendingRequest = pendingRequests.get(chatId) as
        | Promise<T>
        | undefined;

    if (pendingRequest) {
        return pendingRequest;
    }

    const request = fetcher().finally(() => {
        pendingRequests.delete(chatId);
    });

    pendingRequests.set(chatId, request);

    return request;
};
