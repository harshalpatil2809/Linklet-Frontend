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
    onMessageSent: () => void; // Isse hum MessageArea ko refresh karwayenge
}

const ChatInput = ({ activeChat, onMessageSent }: ChatInputProps) => {
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [showEmoji, setShowEmoji] = useState(false)
    const emojiRef = useRef<HTMLDivElement>(null)

    // Emoji picker ke bahar click karne par use band karne ke liye
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
        console.log(activeChat.id)
        setLoading(true)
        try {
            // Aapke backend route ke hisab se call
            await API.post(`/api/messaging/send/${activeChat.id}/`, {
                text: message.trim()
            })
            
            setMessage('')
            setShowEmoji(false)
            onMessageSent() // Message bhejne ke baad history refresh karne ke liye callback
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
                <button
                    type="button"
                    className='p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-[#BA9EFF] hover:border-[#BA9EFF]/30 transition-all'
                >
                    <Plus size={22} />
                </button>

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

export default ChatInput