"use client";

import React from "react";
import { ChevronLeft, UserRound } from "lucide-react";

interface ChatHeaderProps {
    activeChat: {
        id?: string | number;
        name?: string;
        isOnline?: boolean;
        avatar?: string | null;
    } | null;
    onBack?: () => void;
    onShowProfile: () => void;
}

const ChatHeader = ({
    activeChat,
    onBack,
    onShowProfile,
}: ChatHeaderProps) => {
    if (!activeChat) return null;

    const name = activeChat.name?.trim() || "User";
    const isOnline = activeChat.isOnline === true;

    return (
        <header className="z-10 flex shrink-0 items-center gap-3 border-b border-(--color-border) bg-[#0f0f0f] px-3 py-3 sm:px-5 sm:py-4">
            {/* Back Button */}
            {onBack && (
                <button
                    type="button"
                    onClick={onBack}
                    aria-label="Back to chats"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-(--color-text-muted) transition-colors hover:bg-white/5 hover:text-(--color-text) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-border-focus) md:hidden"
                >
                    <ChevronLeft size={21} />
                </button>
            )}

            {/* Clickable User Profile */}
            <button
                type="button"
                onClick={onShowProfile}
                aria-label={`View ${name}'s profile`}
                className="flex min-w-0 flex-1 items-center gap-3 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-border-focus)"
            >
                {/* Avatar */}
                <div className="relative shrink-0">
                    {activeChat.avatar ? (
                        <img
                            src={activeChat.avatar}
                            alt=""
                            className="h-10 w-10 rounded-full border border-(--color-border) object-cover sm:h-11 sm:w-11"
                        />
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-(--color-border) bg-(--color-surface-hover) text-sm font-semibold text-(--color-primary) sm:h-11 sm:w-11">
                            {name !== "User" ? (
                                name.charAt(0).toUpperCase()
                            ) : (
                                <UserRound size={19} />
                            )}
                        </div>
                    )}

                    {/* Online Indicator */}
                    <span
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#101813] ${isOnline
                                ? "bg-(--color-success)"
                                : "bg-(--color-text-subtle)"
                            }`}
                        title={isOnline ? "Online" : "Offline"}
                        aria-label={isOnline ? "Online" : "Offline"}
                    />
                </div>

                {/* Name and Status */}
                <div className="min-w-0 flex-1">
                    <h2 className="truncate text-sm font-semibold leading-5 text-(--color-text) sm:text-base">
                        {name}
                    </h2>

                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-(--color-text-subtle)">
                        <span
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${isOnline
                                    ? "bg-(--color-success)"
                                    : "bg-(--color-text-subtle)"
                                }`}
                        />
                        {isOnline ? "Online" : "Offline"}
                    </p>
                </div>
            </button>
        </header>
    );
};

export default ChatHeader;