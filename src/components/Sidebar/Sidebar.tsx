'use client'
import React from 'react'
import Logo from './Logo'
import SearchUser from './SearchUser'
import ChatList from './ChatList'
import UserProfile from './UserProfile'

// 1. Interface update: onProfileClick add kiya
interface SidebarProps {
    onChatSelect: (chat: any) => void;
    onProfileClick: () => void; 
    activeChatId: number | null;
}

const Sidebar = ({ onChatSelect, onProfileClick, activeChatId }: SidebarProps) => {
    return (
        <aside className='h-screen flex flex-col bg-[#0F0D11] border-r border-white/5 relative overflow-hidden'>

            {/* Logo Section */}
            <div className='p-6 pt-8 shrink-0'>
                <Logo />
            </div>

            {/* Search Section - onChatSelect yahan bhi pass karein taaki search results se chat open ho sake */}
            <div className='shrink-0'>
                <SearchUser onChatSelect={onChatSelect} />
            </div>

            {/* Conversations Label */}
            <div className='px-8 mb-4 shrink-0 flex justify-between items-center'>
                <span className='text-[10px] font-black uppercase tracking-[0.2em] text-[#BA9EFF]/40'>
                    Recent Conversations
                </span>
                <div className='h-px flex-1 ml-4 bg-white/5'></div>
            </div>

            {/* Chat List Section */}
            <div className='flex-1 overflow-y-auto min-h-0 custom-scrollbar'>
                <ChatList onChatSelect={onChatSelect} activeChatId={activeChatId} />
            </div>

            {/* 2. User Profile Section - onProfileClick yahan pass kiya */}
            <div className='shrink-0 bg-linear-to-t from-[#0F0D11] via-[#0F0D11] to-transparent pt-4'>
                <UserProfile onProfileClick={onProfileClick} />
            </div>

            {/* Aesthetic background glow */}
            <div className='absolute -top-24 -left-24 w-48 h-48 bg-[#BA9EFF]/5 blur-[100px] pointer-events-none'></div>
        </aside>
    )
}

export default Sidebar