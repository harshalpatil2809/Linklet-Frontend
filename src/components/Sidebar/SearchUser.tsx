"use client";

import React, { useState, useEffect } from "react";
import { Search, Loader2, UserPlus } from "lucide-react";
import API from "@/lib/axios";

type ChatUser = {
    id: string | number;
    name: string;
    isOnline: boolean;
    isNew: boolean;
    isFollowing: boolean;
    bio: string;
};

interface SearchUserProps {
    onChatSelect: (user: ChatUser) => void;
}

type User = {
    id: string | number;
    username: string;
    is_online: boolean;
    is_following: boolean;
    bio?: string;
};

const SearchUser = ({ onChatSelect }: SearchUserProps) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const trimmedQuery = query.trim();

        if (trimmedQuery.length < 2) {
            setResults([]);
            setIsOpen(false);
            setLoading(false);
            return;
        }

        let cancelled = false;

        const timeoutId = setTimeout(async () => {
            setLoading(true);

            try {
                const res = await API.get(
                    `/api/profiles/search/?search=${encodeURIComponent(trimmedQuery)}`
                );

                if (!cancelled) {
                    setResults(Array.isArray(res.data) ? res.data : []);
                    setIsOpen(true);
                }
            } catch (err) {
                if (!cancelled) {
                    console.error("Search failed:", err);
                    setResults([]);
                    setIsOpen(true);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }, 400);

        return () => {
            cancelled = true;
            clearTimeout(timeoutId);
        };
    }, [query]);

    const handleSelect = (user: User) => {
        onChatSelect({
            id: user.id,
            name: user.username,
            isOnline: user.is_online,
            isNew: true,
            isFollowing: user.is_following,
            bio: user.bio || "Available on Linklet",
        });

        setQuery("");
        setResults([]);
        setIsOpen(false);
    };

    return (
        <div className="relative z-50 mb-6 px-6">
            {/* Search Input */}
            <div className="relative">
                <Search
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-(--color-text-subtle)"
                />

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        if (query.trim().length >= 2) setIsOpen(true);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Escape") setIsOpen(false);
                    }}
                    placeholder="Find people..."
                    aria-label="Search for people"
                    className="w-full rounded-full border border-(--color-border) bg-(--color-input-bg) py-3.5 pl-11 pr-11 text-sm text-(--color-text) placeholder:text-(--color-text-subtle) outline-none transition-colors duration-200 focus:border-(--color-border-focus) focus:bg-(--color-surface)"
                />

                {loading && (
                    <Loader2
                        size={17}
                        className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-(--color-primary)"
                    />
                )}
            </div>

            {/* Search Results */}
            {isOpen && query.trim().length >= 2 && (
                <div className="absolute left-6 right-6 top-full mt-2 overflow-hidden rounded-2xl border border-(--color-border) bg-[#101813] shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
                    <div className="max-h-72 overflow-y-auto p-1.5">
                        {results.length > 0 ? (
                            results.map((user) => (
                                <button
                                    key={user.id}
                                    type="button"
                                    onClick={() => handleSelect(user)}
                                    className="group flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-(--color-border-focus)"
                                >
                                    {/* Avatar */}
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-(--color-border) bg-(--color-surface-hover) text-sm font-semibold text-(--color-primary)">
                                        {user.username?.charAt(0).toUpperCase() || "?"}
                                    </div>

                                    {/* User Details */}
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-(--color-text)">
                                            {user.username}
                                        </p>
                                        <p className="mt-0.5 text-xs text-(--color-text-subtle)">
                                            View profile
                                        </p>
                                    </div>

                                    <UserPlus
                                        size={17}
                                        className="shrink-0 text-(--color-text-subtle) transition-colors group-hover:text-(--color-primary)"
                                    />
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center">
                                <p className="text-sm text-(--color-text-muted)">
                                    {loading ? "Searching..." : "No users found"}
                                </p>
                                {!loading && (
                                    <p className="mt-1 text-xs text-(--color-text-subtle)">
                                        Try another name.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-(--color-border) px-4 py-2.5">
                        <p className="truncate text-xs text-(--color-text-subtle)">
                            Results for &quot;{query.trim()}&quoty;
                        </p>
                    </div>
                </div>
            )}

            {/* Click outside to close */}
            {isOpen && (
                <button
                    type="button"
                    aria-label="Close search results"
                    className="fixed inset-0 z-[-1] cursor-default"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default SearchUser;