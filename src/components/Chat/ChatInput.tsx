'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Send, Plus, Smile, Loader2 } from 'lucide-react'
import API from '@/lib/axios'
import EmojiPicker, { Theme } from 'emoji-picker-react'
import { toast } from 'sonner'

interface ChatInputProps {
    activeChat: {
        id: number;
        username: string;
    } | null;
    onMessageSent: () => void;
    sendMessage: (messageText: string) => void; // Yeh naya prop add kiya hai
}

const ChatInput = ({ activeChat, onMessageSent, sendMessage }: ChatInputProps) => {
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [showEmoji, setShowEmoji] = useState(false)
    const emojiRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
                setShowEmoji(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!message.trim() || !activeChat?.id || loading) return

        setLoading(true)
        try {
            // 1. WebSocket ke through message bhejein (Real-time ke liye)
            sendMessage(message)

            // 2. Agar database mein save karne ke liye API call ki zaroorat ho
            await API.post(`/api/messaging/send/${activeChat.id}/`, {
                text: message.trim()
            })
            
            setMessage('')
            setShowEmoji(false)
            onMessageSent() // Yeh MessageArea ko refresh karega
        } catch (err) {
            toast.error("Message send nahi ho saka")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const onEmojiClick = (emojiData: any) => {
        setMessage(prev => prev + emojiData.emoji)
    }

    return (
        <footer className='p-4 md:p-6 bg-linear-to-t from-[#0F0D11] to-transparent shrink-0 relative'>
            {showEmoji && (
                <div ref={emojiRef} className='absolute bottom-24 left-4 md:left-10 z-50 animate-in zoom-in-95 duration-200'>
                    <EmojiPicker 
                        onEmojiClick={onEmojiClick} 
                        theme={Theme.DARK}
                        skinTonesDisabled
                        searchDisabled={false}
                    />
                </div>
            )}

            <form
                onSubmit={handleSend}
                className='max-w-6xl mx-auto flex items-center gap-3'
            >
                

                <div className='flex-1 relative flex items-center group'>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={!activeChat || loading}
                        placeholder={activeChat ? "Type your message..." : "Select a chat to start..."}
                        className='w-full bg-white/5 border border-white/10 text-white rounded-[2rem] px-6 py-4 pr-14 text-sm focus:outline-none focus:border-[#BA9EFF]/40 focus:ring-4 focus:ring-[#BA9EFF]/5 transition-all placeholder:text-white disabled:opacity-50'
                    />

                    <button
                        type="button"
                        onClick={() => setShowEmoji(!showEmoji)}
                        className={`absolute right-4 transition-colors ${showEmoji ? 'text-[#BA9EFF]' : 'text-white/20 hover:text-[#BA9EFF]'}`}
                    >
                        <Smile size={22} />
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={!message.trim() || loading || !activeChat}
                    className={`p-4 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${
                        message.trim() && !loading
                            ? 'bg-[#BA9EFF] text-black scale-100 shadow-[#BA9EFF]/20 hover:scale-105 active:scale-95'
                            : 'bg-white/5 text-white/20 scale-95 cursor-not-allowed opacity-50'
                    }`}
                >
                    {loading ? <Loader2 size={22} className="animate-spin" /> : <Send size={22} fill={message.trim() ? "currentColor" : "none"} />}
                </button>
            </form>
        </footer>
    )
}

export default ChatInput;