"use client";
import Logo from './Logo'
import SearchUser from './SearchUser'
import ChatList from './ChatList'
import UserProfile from './UserProfile'

export type ChatUser = {
    id: number;
    username: string;
    full_name?: string;
    avatar?: string | null;
    is_online?: boolean;
    isNew?: boolean;
    isFollowing?: boolean;
    bio?: string;
};

interface SidebarProps {
    onChatSelect: (chat: any) => void;
    onProfileClick: () => void;
    activeChatId: number | null;
}

const Sidebar = ({ onChatSelect, onProfileClick, activeChatId }: SidebarProps) => {
    return (
        <aside className='h-screen flex flex-col bg-[#0f0f0f] border-r border-white/10 relative overflow-hidden'>
            <div className='p-6 pt-3 shrink-0'>
                <Logo onChatSelect={onChatSelect} />
            </div>

            <div className='shrink-0'>
                <SearchUser onChatSelect={onChatSelect} />
            </div>

            <div className='px-8 mb-4 shrink-0 flex justify-between items-center'>
                <span className='text-[10px] font-black uppercase tracking-[0.2em] text-white/40'>
                    Recent Conversations
                </span>
                <div className='h-px flex-1 ml-4 bg-white/10'></div>
            </div>

            <div className='flex-1 overflow-y-auto min-h-0 custom-scrollbar'>
                <ChatList onChatSelect={onChatSelect} activeChatId={activeChatId} />
            </div>

            <div className='shrink-0 bg-linear-to-t from-[#121412] via-[#121412] to-transparent pt-4'>
                <UserProfile onProfileClick={onProfileClick} />
            </div>

            
        </aside>
    )
}

export default Sidebar;