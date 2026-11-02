
"use client";

import React from "react";
import { Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
    text: string;
    sender: "me" | "other";
    time: string;
    status?: "sent" | "delivered" | "read";
}

const MessageBubble = ({
    text,
    sender,
    time,
    status = "read",
}: MessageBubbleProps) => {
    const isMe = sender === "me";

    return (
        <div
            className={`mb-4 flex px-2 ${
                isMe ? "justify-end" : "justify-start"
            }`}
        >
            <div
                className={`flex max-w-[85%] flex-col gap-1.5 md:max-w-[70%] ${
                    isMe ? "items-end" : "items-start"
                }`}
            >
                {/* Message content */}
                <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed break-words whitespace-pre-wrap md:text-[15px] ${
                        isMe
                            ? "rounded-br-sm bg-[#8FB59A] text-[#101813]"
                            : "rounded-bl-sm border border-[rgba(213,229,215,0.18)] bg-[rgba(22,34,27,0.78)] text-[#F5F5F0]"
                    }`}
                >
                    {text}
                </div>

                {/* Timestamp and delivery status */}
                <div className="flex items-center gap-1.5 px-1">
                    <span className="text-[11px] text-[#8F9C92]">
                        {time}
                    </span>

                    {isMe && (
                        <span className="flex items-center">
                            {status === "sent" && (
                                <Check
                                    size={13}
                                    strokeWidth={2}
                                    className="text-[#8F9C92]"
                                    aria-label="Sent"
                                />
                            )}

                            {status === "delivered" && (
                                <CheckCheck
                                    size={14}
                                    strokeWidth={2}
                                    className="text-[#8F9C92]"
                                    aria-label="Delivered"
                                />
                            )}

                            {status === "read" && (
                                <CheckCheck
                                    size={14}
                                    strokeWidth={2}
                                    className="text-[#8FB59A]"
                                    aria-label="Read"
                                />
                            )}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
