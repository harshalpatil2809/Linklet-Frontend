'use client'
import React from 'react'
import Logo from './Logo'
import SearchUser from './SearchUser'
import ChatList from './ChatList'
import UserProfile from './UserProfile'

interface SidebarProps {
    onChatSelect: (chat: any) => void;
    activeChatId: number | null;
}

const Sidebar = ({ onChatSelect, activeChatId }: SidebarProps) => {
    return (
        <aside className='h-screen flex flex-col bg-[#0F0D11] border-r border-white/5 relative overflow-hidden'>

            {/* 1. Logo Section - Fixed at Top */}
            <div className='p-6 pt-8 shrink-0'>
                <Logo />
            </div>

            {/* 2. Search Section - Fixed below Logo */}
            <div className='shrink-0'>
                <SearchUser onChatSelect={onChatSelect}/>
            </div>

            {/* 3. Conversations Label - Just for UX */}
            <div className='px-8 mb-4 shrink-0 flex justify-between items-center'>
                <span className='text-[10px] font-black uppercase tracking-[0.2em] text-[#BA9EFF]/40'>
                    Recent Conversations
                </span>
                <div className='h-px flex-1 ml-4 bg-white/5'></div>
            </div>

            {/* 4. Chat List Section - Scrollable */}
            {/* 'flex-1' ensures it takes all available space, 'overflow-y-auto' makes it scrollable */}
            <div className='flex-1 overflow-y-auto min-h-0 custom-scrollbar'>
                <ChatList onChatSelect={onChatSelect} activeChatId={activeChatId} />
            </div>

            {/* 5. User Profile - Fixed at Bottom */}
            <div className='shrink-0 bg-linear-to-t from-[#0F0D11] via-[#0F0D11] to-transparent pt-4'>
                <UserProfile />
            </div>

            {/* Optional: Subtle background glow for aesthetics */}
            <div className='absolute -top-24 -left-24 w-48 h-48 bg-[#BA9EFF]/5 blur-[100px] pointer-events-none'></div>
        </aside>
    )
}

export default Sidebar