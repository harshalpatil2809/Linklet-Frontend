"use client";
import React, { useEffect, useRef, useState } from "react";
import API from '@/lib/axios';

interface Message {
    id?: number;
    text?: string;
    message?: string;
    sender?: number;
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
    messages: any[];
}

const MessageArea = ({ activeChat, messages: liveMessages }: MessageAreaProps) => {
    const [historyMessages, setHistoryMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentUserId(localStorage.getItem('userid'));
        }
    }, []);

    const fetchChatHistory = async () => {
        if (!activeChat?.id) return;

        setLoading(true);
        try {
            const response = await API.get(`/api/messaging/history/${activeChat.id}/`);
            setHistoryMessages(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeChat?.id) {
            fetchChatHistory();
        } else {
            setHistoryMessages([]);
        }
    }, [activeChat?.id]);

    const allMessages = [...historyMessages, ...liveMessages];

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [allMessages]);

    return (
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar bg-[#0D0B0F]">
            {!activeChat ? (
                <div className="h-full flex items-center justify-center text-white/20">
                    Select a conversation to start chatting
                </div>
            ) : loading ? (
                <div className="text-white/50 text-center py-10">Loading conversation...</div>
            ) : allMessages.length === 0 ? (
                <div className="text-white/20 text-center py-10 italic font-medium">No messages yet. Say hi!</div>
            ) : (
                allMessages.map((msg, index) => {
                    const actualText = msg.text || msg.message;
                    const actualSenderId = String(msg.sender || msg.sender_id);
                    const isMe = actualSenderId === currentUserId;

                    const timeStr = msg.timestamp
                        ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    return (
                        <div
                            key={msg.id || `live-${index}`}
                            className={`flex ${isMe ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-500`}
                        >
                            <div className={`flex flex-col gap-1.5 max-w-[80%] md:max-w-[60%] ${isMe ? "items-end" : "items-start"}`}>
                                <div className={`px-5 py-3.5 rounded-[2rem] text-sm leading-relaxed shadow-lg ${isMe
                                        ? "bg-[#BA9EFF] text-black font-semibold rounded-tr-none"
                                        : "bg-white/5 border border-white/10 text-white/90 rounded-tl-none"
                                    }`}>
                                    {actualText}
                                </div>
                                <span className="text-[10px] text-white/20 font-medium px-2">
                                    {timeStr}
                                </span>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default MessageArea;