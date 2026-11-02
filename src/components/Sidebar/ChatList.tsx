
'use client'

import React, { useEffect, useState } from 'react'
import API from '@/lib/axios'
import { Loader2, MessageCircle } from 'lucide-react'

export interface ChatItem {
    id: number
    name: string
    lastMsg: string
    time: string
    unread: number
    avatar?: string
    isOnline: boolean
}

type Chat = {
    id?: number
    username?: string
    text?: string
    timestamp?: string
    unread_count?: number
    is_online?: boolean
    avatar?: string
}

type ChatListProps = {
    onChatSelect: (chat: ChatItem) => void
    activeChatId: number | null
}

const ChatList = ({
    onChatSelect,
    activeChatId,
}: ChatListProps) => {
    const [chats, setChats] = useState<ChatItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchInbox = async () => {
            try {
                const res = await API.get('/api/profiles/mutual/')

                const formattedChats: ChatItem[] = (
                    Array.isArray(res.data) ? res.data : []
                ).map((item: Chat, index: number) => ({
                    id: item.id ?? -(index + 1),
                    name: item.username || 'Unknown User',
                    lastMsg: item.text || 'No messages yet',
                    time: item.timestamp || '',
                    unread: item.unread_count ?? 0,
                    isOnline: item.is_online ?? false,
                    avatar: item.avatar,
                }))

                setChats(formattedChats)
            } catch (err) {
                console.error('Failed to fetch inbox:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchInbox()
    }, [])

    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center py-12">
                <Loader2
                    size={22}
                    className="animate-spin text-(--color-primary)"
                />
            </div>
        )
    }

    if (chats.length === 0) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-(--color-border) bg-(--color-surface)">
                    <MessageCircle
                        size={22}
                        className="text-(--color-text-muted)"
                    />
                </div>

                <p className="text-sm font-medium text-(--color-text)">
                    No conversations yet
                </p>

                <p className="mt-1 text-xs text-(--color-text-muted)">
                    Start a conversation to see it here.
                </p>
            </div>
        )
    }

    return (
        <div className="mt-2 flex-1 space-y-1 overflow-y-auto px-3 pb-3">
            {chats.map((chat) => {
                const isActive = activeChatId === chat.id

                return (
                    <button
                        key={chat.id}
                        type="button"
                        onClick={() => onChatSelect(chat)}
                        aria-pressed={isActive}
                        className={`group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors duration-200 ${isActive
                                ? 'border-(--color-border-focus) bg-(--color-surface-hover)'
                                : 'border-transparent hover:border-(--color-border) hover:bg-(--color-surface)'
                            }`}
                    >
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            {chat.avatar ? (
                                <img
                                    src={chat.avatar}
                                    alt="avatar"
                                    className="h-11 w-11 rounded-full border border-(--color-border) object-cover"
                                />
                            ) : (
                                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-(--color-border) bg-(--color-surface-hover) text-sm font-semibold text-(--color-primary)">
                                    {chat.name.charAt(0).toUpperCase()}
                                </div>
                            )}

                            {chat.isOnline && (
                                <span
                                    aria-label="Online"
                                    className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-(--color-bg) bg-(--color-primary)"
                                />
                            )}
                        </div>

                        {/* Chat Details */}
                        <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-center justify-between gap-2">
                                <h3
                                    className={`truncate text-sm font-semibold ${isActive
                                            ? 'text-(--color-primary)'
                                            : 'text-(--color-text)'
                                        }`}
                                >
                                    {chat.name}
                                </h3>

                                {chat.time && (
                                    <span className="shrink-0 text-[11px] text-(--color-text-subtle)">
                                        {chat.time}
                                    </span>
                                )}
                            </div>

                            {/* <div className="flex items-center justify-between gap-2">
                                <p className="truncate text-xs text-(--color-text-muted)">
                                    {chat.lastMsg}
                                </p>

                                {chat.unread > 0 && (
                                    <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-(--color-primary) px-1.5 text-[10px] font-bold text-(--color-primary-text)">
                                        {chat.unread > 99 ? '99+' : chat.unread}
                                    </span>
                                )}
                            </div> */}
                        </div>
                    </button>
                )
            })}
        </div>
    )
}

export default ChatList
