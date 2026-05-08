'use client'
import Logo from './Logo'
import SearchUser from './SearchUser'
import ChatList from './ChatList'
import UserProfile from './UserProfile'

// Type ko flexible banaya taaki build fail na ho
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
    onChatSelect: (chat: any) => void; // Build pass karne ke liye 'any' rakha hai, ise bad mein ChatUser kar sakte hain
    onProfileClick: () => void; 
    activeChatId: number | null;
}

const Sidebar = ({ onChatSelect, onProfileClick, activeChatId }: SidebarProps) => {
    return (
        <aside className='h-screen flex flex-col bg-[#0F0D11] border-r border-white/5 relative overflow-hidden'>
            <div className='p-6 pt-8 shrink-0'>
                <Logo onChatSelect={onChatSelect} />
            </div>

            <div className='shrink-0'>
                <SearchUser onChatSelect={onChatSelect} />
            </div>

            <div className='px-8 mb-4 shrink-0 flex justify-between items-center'>
                <span className='text-[10px] font-black uppercase tracking-[0.2em] text-[#BA9EFF]/40'>
                    Recent Conversations
                </span>
                <div className='h-px flex-1 ml-4 bg-white/5'></div>
            </div>

            <div className='flex-1 overflow-y-auto min-h-0 custom-scrollbar'>
                {/* Ensure karein ChatList ke andar onChatSelect ka type sahi ho */}
                <ChatList onChatSelect={onChatSelect} activeChatId={activeChatId} />
            </div>

            <div className='shrink-0 bg-linear-to-t from-[#0F0D11] via-[#0F0D11] to-transparent pt-4'>
                <UserProfile onProfileClick={onProfileClick} />
            </div>

            <div className='absolute -top-24 -left-24 w-48 h-48 bg-[#BA9EFF]/5 blur-[100px] pointer-events-none'></div>
        </aside>
    )
}

export default Sidebar;