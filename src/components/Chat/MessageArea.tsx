
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import API from "@/lib/axios";
import { getOrFetchChatHistory } from "@/lib/cache/messageCache";

interface Message {
    id?: number;
    text?: string;
    message?: string;
    sender?: number | string;
    sender_id?: number | string;
    sender_username?: string;
    timestamp?: string;
}

interface MessageAreaProps {
    activeChat: {
        id: number;
        username: string;
        full_name?: string;
    } | null;
    messages: Message[];
}

const MessageArea = ({
    activeChat,
    messages: liveMessages,
}: MessageAreaProps) => {
    const [historyMessages, setHistoryMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);

    // Identify the logged-in user.
    useEffect(() => {
        setCurrentUserId(localStorage.getItem("userid"));
    }, []);

    // Load conversation history when the active chat changes.
    useEffect(() => {
        let isActive = true;

        if (!activeChat?.id) {
            setHistoryMessages([]);
            setLoading(false);
            return;
        }

        const fetchChatHistory = async () => {
            setLoading(true);
            setHistoryMessages([]);

            try {
                const data = await getOrFetchChatHistory<Message[]>(
                    activeChat.id,
                    async () => {
                        const response = await API.get(
                            `/api/messaging/history/${activeChat.id}/`
                        );

                        return response.data;
                    }
                );

                if (isActive) {
                    setHistoryMessages(data);
                }
            } catch (error) {
                if (isActive) {
                    console.error("Failed to load chat history:", error);
                }
            } finally {
                if (isActive) {
                    setLoading(false);
                }
            }
        };

        fetchChatHistory();

        return () => {
            isActive = false;
        };
    }, [activeChat?.id]);

    // Combine previous messages with incoming real-time messages.
    const allMessages = useMemo(
        () => [...historyMessages, ...liveMessages],
        [historyMessages, liveMessages]
    );

    // Scroll to the latest message when the conversation updates.
    useEffect(() => {
        const container = scrollRef.current;

        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [allMessages]);

    return (
        <div
            ref={scrollRef}
            className="flex-1 min-h-0 overflow-y-auto (--color-bg) px-4 py-5 md:px-8 md:py-6"
        >
            {!activeChat ? (
                <div className="flex h-full items-center justify-center text-center text-sm text-[#8F9C92]">
                    Select a conversation to start chatting
                </div>
            ) : loading ? (
                <div className="py-10 text-center text-sm text-[#B5C0B8]">
                    Loading conversation...
                </div>
            ) : allMessages.length === 0 ? (
                <div className="py-10 text-center text-sm text-[#8F9C92]">
                    No messages yet. Say hi!
                </div>
            ) : (
                <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
                    {allMessages.map((msg, index) => {
                        const messageText = msg.text ?? msg.message ?? "";

                        const senderId = String(
                            msg.sender ?? msg.sender_id ?? ""
                        );

                        const isOutgoing =
                            currentUserId !== null &&
                            senderId === currentUserId;

                        const messageTime = msg.timestamp
                            ? new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })
                            : "";

                        return (
                            <div
                                key={msg.id ?? `message-${index}`}
                                className={`flex ${isOutgoing ? "justify-end" : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`flex max-w-[85%] flex-col gap-1.5 md:max-w-[65%] ${isOutgoing ? "items-end" : "items-start"
                                        }`}
                                >
                                    <div
                                        className={`relative wrap-break-word whitespace-pre-wrap px-4 py-3 text-sm leading-relaxed ${isOutgoing
                                            ? "rounded bg-[#29382c] text-white"
                                            : "rounded border border-[rgba(213,229,215,0.18)] bg-[rgba(22,34,27,0.78)] text-[#F5F5F0]"
                                            }`}
                                    >
                                        {messageText}
                                    </div>

                                    {messageTime && (
                                        <span className="px-1 text-[11px] text-[#8F9C92]">
                                            {messageTime}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MessageArea;
