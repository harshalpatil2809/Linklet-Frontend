'use client'
import React from 'react'
import { Check, CheckCheck } from 'lucide-react'

interface MessageBubbleProps {
    text: string;
    sender: 'me' | 'other';
    time: string;
    status?: 'sent' | 'delivered' | 'read';
}

const MessageBubble = ({ text, sender, time, status = 'read' }: MessageBubbleProps) => {
    const isMe = sender === 'me';

    return (
        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4 px-2`}>
            <div className={`flex flex-col gap-1 max-w-[85%] md:max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>

                {/* Bubble UI */}
                <div className={`relative px-5 py-3 rounded-[2rem] text-sm md:text-[15px] leading-relaxed shadow-lg transition-all duration-300
          ${isMe
                        ? 'bg-[#BA9EFF] text-black font-semibold rounded-tr-none shadow-[#BA9EFF]/10'
                        : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-none shadow-black/20'
                    }
        `}>
                    {text}
                </div>

                {/* Footer: Time + Status Ticks */}
                <div className={`flex items-center gap-1.5 px-2 mt-0.5`}>
                    <span className='text-[9px] text-white/20 font-bold uppercase tracking-wider'>
                        {time}
                    </span>

                    {isMe && (
                        <div className='flex items-center'>
                            {status === 'sent' && <Check size={12} className='text-white/20' />}
                            {status === 'delivered' && <CheckCheck size={12} className='text-white/20' />}
                            {status === 'read' && <CheckCheck size={12} className='text-black' />}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default MessageBubble