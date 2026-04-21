'use client'
import React, { useEffect, useState } from 'react'
import API from '@/lib/axios'
import { Loader2 } from 'lucide-react'

interface ChatItem {
    id: number;
    name: string;
    lastMsg: string;
    time: string;
    unread: number;
    avatar?: string;
    isOnline: boolean;
}

type Chat = {
    id?: number;
    username?: string;
    text?: string;
    timestamp?: string;
    unread_count?: number;
    is_online?: boolean;
};

type ChatListProps = {
  onChatSelect: (chat: ChatItem) => void;
  activeChatId: number | null;
};

const ChatList = ({ onChatSelect, activeChatId }: ChatListProps) => {
    const [chats, setChats] = useState<ChatItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInbox = async () => {
            try {
                const res = await API.get('/api/profiles/mutual/');

                const formattedChats = res.data.map((item: Chat) => {

                    return {
                        id: item.id || Math.random(), // Fallback agar id na ho
                        name: item.username || "Unknown User",
                        lastMsg: item.text || "No messages yet",
                        time: item.timestamp || "",
                        unread: item.unread_count || 0,
                        isOnline: item.is_online || false
                    };
                });

                setChats(formattedChats);
            } catch (err) {
                console.error("Failed to fetch inbox:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInbox();
    }, []);

    if (loading) {
        return (
            <div className='flex-1 flex items-center justify-center'>
                <Loader2 size={24} className='text-[#BA9EFF] animate-spin opacity-20' />
            </div>
        );
    }

    if (chats.length === 0) {
        return (
            <div className='flex-1 px-8 flex items-center justify-center text-center'>
                <p className='text-xs text-white/20 font-medium uppercase tracking-widest'>
                    No conversations yet. Start a new one!
                </p>
            </div>
        );
    }

    return (
        <div className='flex-1 overflow-y-auto px-4 mt-2 custom-scrollbar space-y-2'>
            {chats.map((chat) => (
                <div
                    key={chat.id}
                    onClick={() => onChatSelect(chat)}
                    className={`group flex items-center gap-4 p-4 rounded-[2rem] cursor-pointer transition-all duration-300 border ${activeChatId === chat.id
                        ? 'bg-[#BA9EFF]/10 border-[#BA9EFF]/20 shadow-lg shadow-black/20'
                        : 'hover:bg-white/5 border-transparent'
                        }`}
                >
                    {/* Profile Section */}
                    <div className='relative shrink-0'>
                        <div className={`w-14 h-14 rounded-full bg-linear-to-br from-[#BA9EFF] to-[#43237A] flex items-center justify-center text-black font-bold text-xl border-2 ${activeChatId === chat.id ? 'border-[#BA9EFF]' : 'border-white/10'}`}>
                            {chat.name[0]}
                        </div>
                        {chat.isOnline && (
                            <div className='absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-4 border-[#0F0D11] rounded-full'></div>
                        )}
                    </div>

                    {/* Text Content */}
                    <div className='flex-1 min-w-0'>
                        <div className='flex justify-between items-baseline mb-1'>
                            <h3 className={`font-bold truncate transition-colors ${activeChatId === chat.id ? 'text-[#BA9EFF]' : 'text-white'}`}>
                                {chat.name}
                            </h3>
                            <span className='text-[10px] text-white/30 font-medium uppercase shrink-0 tracking-wider'>
                                {chat.time}
                            </span>
                        </div>

                        <div className='flex justify-between items-center gap-2'>
                            <p className={`text-sm truncate transition-all ${activeChatId === chat.id ? 'text-white/80' : 'text-white/40'}`}>
                                {chat.lastMsg}
                            </p>

                            {chat.unread > 0 && (
                                <div className='bg-[#BA9EFF] text-black text-[10px] font-black px-2 py-0.5 rounded-full min-w-[1.2rem] text-center'>
                                    {chat.unread}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ChatList