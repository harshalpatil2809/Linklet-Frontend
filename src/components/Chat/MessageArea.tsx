"use client";
import React, { useEffect, useRef } from "react";

interface Message {
    id: number;
    text: string;
    sender: "me" | "other";
    time: string;
}

const MessageArea = ({ activeChat }: any) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Dummy Messages for UI Design
    const messages: Message[] = [
        {
            id: 1,
            text: "Hey! Linklet ka design kaisa lag raha hai?",
            sender: "other",
            time: "10:00 AM",
        },
        {
            id: 2,
            text: "Bhai ekdum premium vibe aa rahi hai! Purple accent sahi lag raha hai.",
            sender: "me",
            time: "10:02 AM",
        },
        {
            id: 3,
            text: "Wait, responsiveness check ki?",
            sender: "other",
            time: "10:05 AM",
        },
        {
            id: 4,
            text: "Haan, mobile aur desktop dono sorted hain. Abhi MessageArea assemble kar raha hoon.",
            sender: "me",
            time: "10:06 AM",
        },
    ];

    // Auto-scroll to bottom whenever messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar bg-[#0D0B0F]"
        >
            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-500`}
                >
                    {/* Message Bubble Container */}
                    <div
                        className={`flex flex-col gap-1.5 max-w-[80%] md:max-w-[60%] ${msg.sender === "me" ? "items-end" : "items-start"}`}
                    >
                        {/* Bubble UI */}
                        <div
                            className={`
              px-5 py-3.5 rounded-[2rem] text-sm leading-relaxed shadow-lg
              ${msg.sender === "me"
                                    ? "bg-[#BA9EFF] text-black font-semibold rounded-tr-none shadow-[#BA9EFF]/5"
                                    : "bg-white/5 border border-white/10 text-white/90 rounded-tl-none shadow-black/20"
                                }
            `}
                        >
                            {msg.text}
                        </div>

                        {/* Time Stamp */}
                        <span className="text-[10px] text-white/20 font-medium uppercase tracking-widest px-2">
                            {msg.time}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MessageArea;
