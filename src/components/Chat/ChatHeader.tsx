'use client'
import React from 'react'
import { ChevronLeft } from 'lucide-react'

interface ChatHeaderProps {
    activeChat: any;
    onBack?: () => void; 
    onShowProfile: () => void;
}

const ChatHeader = ({ activeChat, onBack }: ChatHeaderProps) => {
    if (!activeChat) return null;

    return (
        <header className='p-4 md:p-6 border-b border-white/5 bg-[#0F0D11]/60 backdrop-blur-xl flex justify-between items-center shrink-0 z-10'>

            {/* Left Section: Back Button + User Info */}
            <div className='flex items-center gap-3 md:gap-4'>
                {/* Back Button (Visible only on Mobile) */}
                <button
                    onClick={onBack}
                    className='md:hidden p-2 -ml-2 text-white/50 hover:text-white transition-colors'
                >
                    <ChevronLeft size={28} />
                </button>

                {/* User Avatar with Online Indicator */}
                <div className='relative'>
                    <div className='w-10 h-10 md:w-12 md:h-12 rounded-full bg-linear-to-br from-[#BA9EFF] to-[#43237A] border-2 border-white/10 flex items-center justify-center text-black font-bold text-lg'>
                        {activeChat.name[0]}
                    </div>
                    {activeChat.isOnline && (
                        <div className='absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#0F0D11] rounded-full'></div>
                    )}
                </div>

                {/* Name and Status */}
                <div className='flex flex-col'>
                    <h2 className='text-sm md:text-lg font-bold text-white tracking-tight leading-tight'>
                        {activeChat.name}
                    </h2>
                    <span className='text-[10px] md:text-xs font-medium text-green-500/80 mt-0.5 flex items-center gap-1.5'>
                        <span className='w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse'></span>
                        Online
                    </span>
                </div>
            </div>

            

        </header>
    )
}

export default ChatHeader