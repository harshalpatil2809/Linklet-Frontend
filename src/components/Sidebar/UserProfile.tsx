
"use client";

import React, { useEffect, useState } from "react";
import { LogOut, Loader2, UserRound } from "lucide-react";
import { logout } from "@/lib/auth";
import API from "@/lib/axios";
import {
    getOrFetchCurrentUserProfile,
} from "@/lib/cache/profileCache";

interface CachedUserProfile {
    id?: number;
    username?: string;
    full_name?: string | null;
    bio?: string | null;
    avatar?: string | null;
}

interface UserData {
    name: string;
    username: string;
    avatar?: string | null;
}
interface UserProfileProps {
    onProfileClick: () => void;
}

const UserProfile = ({ onProfileClick }: UserProfileProps) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const fetchUserProfile = async () => {
            try {
                const userId = localStorage.getItem("userid");

                const profile =
                    await getOrFetchCurrentUserProfile<CachedUserProfile>(
                        userId,
                        async () => {
                            const res = await API.get<CachedUserProfile>(
                                "/api/profiles/me/"
                            );

                            return res.data;
                        }
                    );

                if (cancelled) return;

                setUser({
                    name:
                        profile.full_name?.trim() ||
                        profile.username ||
                        "User",
                    username: profile.username
                        ? `@${profile.username}`
                        : "@user",
                    avatar: profile.avatar || null,
                });
            } catch (err) {
                if (!cancelled) {
                    console.error("User profile fetch failed:", err);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchUserProfile();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleLogout = async (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.stopPropagation();

        if (loggingOut) return;

        setLoggingOut(true);

        try {
            await logout();
        } catch (err) {
            console.error("Logout failed:", err);
            setLoggingOut(false);
        }
    };

    if (loading) {
        return (
            <div className="mt-auto p-3 sm:p-4">
                <div className="flex items-center gap-3 rounded-2xl border border-(--color-border) bg-(--color-surface) p-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--color-surface-hover)">
                        <Loader2
                            size={18}
                            className="animate-spin text-(--color-primary)"
                        />
                    </div>

                    <div className="min-w-0 flex-1 space-y-2">
                        <div className="h-3 w-24 max-w-full animate-pulse rounded bg-white/10" />
                        <div className="h-2.5 w-16 max-w-full animate-pulse rounded bg-white/[0.06]" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-auto p-3 sm:p-4 border-t border-white/10">
            <div
                role="button"
                tabIndex={0}
                onClick={onProfileClick}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onProfileClick();
                    }
                }}
                aria-label="Open your profile"
                className="group flex min-w-0 cursor-pointer items-center gap-3 rounded-2xl p-3 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-border-focus)"
            >
                {/* Avatar */}
                <div className="relative shrink-0">
                    {user?.avatar ? (
                        <img
                            src={user.avatar}
                            alt=""
                            className="h-10 w-10 rounded-full border border-(--color-border) object-cover"
                        />
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-(--color-border) bg-(--color-surface-hover) text-sm font-semibold text-(--color-primary)">
                            {user?.name?.charAt(0)?.toUpperCase() || (
                                <UserRound size={18} />
                            )}
                        </div>
                    )}

                    <span
                        aria-label="Online"
                        title="Online"
                        className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#101813] bg-(--color-success)"
                    />
                </div>

                {/* User Information */}
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium leading-5 text-(--color-text)">
                        {user?.name || "Your profile"}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-(--color-text-subtle)">
                        {user?.username || "View profile"}
                    </p>
                </div>

                {/* Logout */}
                <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    aria-label="Log out"
                    title="Log out"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-(--color-text-subtle) transition-colors hover:bg-red-400/10 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-border-focus) disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                    {loggingOut ? (
                        <Loader2 size={17} className="animate-spin" />
                    ) : (
                        <LogOut size={17} />
                    )}
                </button>
            </div>
        </div>
    );
};

export default UserProfile;
