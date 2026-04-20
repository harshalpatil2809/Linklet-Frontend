'use client'
import React, { useState } from 'react'
import { Send, Plus, Smile } from 'lucide-react'

const ChatInput = () => {
    const [message, setMessage] = useState('')

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault()
        if (message.trim()) {
            console.log("Sending:", message)
            // Yahan aapka API call logic aayega
            setMessage('')
        }
    }

    return (
        <footer className='p-4 md:p-6 bg-gradient-to-t from-[#0F0D11] to-transparent shrink-0'>
            <form
                onSubmit={handleSend}
                className='max-w-6xl mx-auto flex items-center gap-3'
            >
                {/* Attachment/Plus Button */}
                <button
                    type="button"
                    className='p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-[#BA9EFF] hover:border-[#BA9EFF]/30 transition-all'
                >
                    <Plus size={22} />
                </button>

                {/* Input Wrapper */}
                <div className='flex-1 relative flex items-center group'>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className='w-full bg-white/5 border border-white/10 rounded-[2rem] px-6 py-4 pr-14 text-sm focus:outline-none focus:border-[#BA9EFF]/40 focus:ring-4 focus:ring-[#BA9EFF]/5 transition-all placeholder:text-white/20'
                    />

                    {/* Emoji Button inside input */}
                    <button
                        type="button"
                        className='absolute right-4 text-white/20 hover:text-[#BA9EFF] transition-colors'
                    >
                        <Smile size={22} />
                    </button>
                </div>

                {/* Send Button */}
                <button
                    type="submit"
                    disabled={!message.trim()}
                    className={`p-4 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${message.trim()
                            ? 'bg-[#BA9EFF] text-black scale-100 shadow-[#BA9EFF]/20 hover:scale-105 active:scale-95'
                            : 'bg-white/5 text-white/20 scale-95 cursor-not-allowed opacity-50'
                        }`}
                >
                    <Send size={22} fill={message.trim() ? "currentColor" : "none"} />
                </button>
            </form>
        </footer>
    )
}

export default ChatInput