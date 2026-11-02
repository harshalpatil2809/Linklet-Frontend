
'use client'

import Link from "next/link";
import NotificationBell from "./NotificationBell";
import type { ChatItem } from "./ChatList";

interface LogoProps {
    onChatSelect: (chat: ChatItem) => void;
}

const Logo = ({ onChatSelect }: LogoProps) => {
    return (
        <div className="flex items-center justify-between">
            <Link
                href="/dashboard"
                className="group flex w-fit items-center gap-3"
            >


                {/* Brand Name */}
                <div className="flex flex-col">
                    <h1 className="text-2xl font-black tracking-tighter text-(--color-text) transition-colors duration-300 group-hover:text-(--color-primary)">
                        Linklet
                    </h1>

                    <div className="h-1 w-0 rounded-full bg-(--color-primary) transition-all duration-300 group-hover:w-full" />
                </div>
            </Link>

            {/* Notifications */}
            <div className="flex items-center gap-4">
                <NotificationBell onChatSelect={onChatSelect} />
            </div>
        </div>
    );
};

export default Logo;
