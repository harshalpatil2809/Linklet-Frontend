'use client'
import React, { useEffect, useState } from 'react'
import { LogOut, MoreHorizontal, Loader2 } from 'lucide-react'
import { logout } from '@/lib/auth'
import API from '@/lib/axios'

interface UserData {
  name: string;
  username: string;
  avatar?: string;
}

const UserProfile = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await API.get('/api/profiles/me/'); 
        setUser({
          name: res.data.first_name + " " + res.data.last_name || res.data.username,
          username: `@${res.data.username}`,
          avatar: res.data.profile_picture // Agar aapne field banayi hai
        });
      } catch (err) {
        console.error("User profile fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className='p-4 mt-auto'>
        <div className='bg-white/5 border border-white/10 p-4 rounded-[2rem] flex items-center justify-center'>
          <Loader2 size={20} className='text-[#BA9EFF] animate-spin' />
        </div>
      </div>
    );
  }

  return (
    <div className='p-4 mt-auto'>
      <div className='bg-white/5 border border-white/10 p-4 rounded-[2rem] flex items-center gap-3 group hover:bg-white/[0.08] transition-all duration-500'>

        {/* Avatar Section */}
        <div className='relative shrink-0'>
          <div className='w-11 h-11 rounded-full bg-[#BA9EFF] flex items-center justify-center text-black font-extrabold shadow-[0_0_15px_rgba(186,158,255,0.2)] group-hover:scale-105 transition-transform uppercase'>
            {user?.name?.[0] || 'U'}
          </div>
          <div className='absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-[#0F0D11] rounded-full'></div>
        </div>

        {/* User Info */}
        <div className='flex-1 min-w-0'>
          <h4 className='text-sm font-bold text-white truncate leading-tight'>
            {user?.name}
          </h4>
          <p className='text-[10px] text-white/40 font-medium truncate uppercase tracking-wider'>
            {user?.username}
          </p>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
          <button
            onClick={() => logout()}
            className='p-2 hover:bg-red-500/20 rounded-xl text-red-400 transition-colors'
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>

        {/* More Icon (Visible when not hovered) */}
        <div className='group-hover:hidden text-white/20'>
          <MoreHorizontal size={18} />
        </div>

      </div>
    </div>
  )
}

export default UserProfile