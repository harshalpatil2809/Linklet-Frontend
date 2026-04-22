'use client'
import React, { useState, useEffect } from 'react'
import { UserPlus, UserMinus, Loader2 } from 'lucide-react'
import API from '@/lib/axios'
import { toast } from 'sonner'

const UserProfileView = ({ user }: any) => {
    const [isFollowing, setIsFollowing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)

    useEffect(() => {
    const fetchFreshStatus = async () => {
        setFetching(true);
        try {
            const res = await API.get(`/api/profiles/target/${user.name}/`); 
            setIsFollowing(res.data.is_following);
        } catch (err) {
            console.error("Error fetching target profile:", err);
        } finally {
            setFetching(false);
        }
    };

    if (user?.name) {
        fetchFreshStatus();
    }
}, [user.name]);

    const handleFollowAction = async () => {
        if (loading) return
        setLoading(true)
        try {
            const res = await API.post(`/api/follows/toggle/${user.name}/`)
            const newStatus = res.data.following ?? !isFollowing
            setIsFollowing(newStatus)
            toast.success(res.data.message || "Updated successfully")
        } catch {
            toast.error("Action failed. Try again.")
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="animate-spin text-[#BA9EFF]" size={32} />
            </div>
        )
    }

    return (
        <div className='flex-1 flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-500'>
            <div className='w-full max-w-sm bg-white/5 border border-white/10 rounded-[3rem] p-8 flex flex-col items-center text-center shadow-2xl'>

                {/* Large Avatar */}
                <div className='w-32 h-32 rounded-full bg-linear-to-br from-[#BA9EFF] to-[#43237A] p-1 mb-6'>
                    <div className='w-full h-full rounded-full bg-[#0F0D11] flex items-center justify-center text-5xl font-black text-[#BA9EFF] border-4 border-white/5'>
                        {user.name[0].toUpperCase()}
                    </div>
                </div>

                {/* User Info */}
                <h2 className='text-3xl font-bold mb-1'>{user.name}</h2>
                <p className='text-white/40 mb-8 font-medium uppercase tracking-widest text-[10px]'>@{user.name.toLowerCase()}</p>

                {/* Action Buttons */}
                <div className='flex gap-4 w-full'>
                    <button
                        onClick={handleFollowAction}
                        disabled={loading}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all active:scale-95 ${isFollowing
                            ? 'bg-white/5 text-white/60 border border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/20'
                            : 'bg-[#BA9EFF] text-black hover:bg-[#a686ff] shadow-lg shadow-[#BA9EFF]/20'
                            }`}
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : isFollowing ? <><UserMinus size={18} /> Unfollow</> : <><UserPlus size={18} /> Follow</>}
                    </button>
                </div>

                {/* Extra Stats/Info */}
                <div className='grid grid-cols-2 gap-4 w-full mt-8 pt-8 border-t border-white/5'>
                    <div className='flex flex-col'>
                        <span className='text-white/20 text-[9px] font-bold uppercase'>Account Status</span>
                        <span className='text-green-500 text-xs font-bold'>Verified User</span>
                    </div>
                    <div className='flex flex-col'>
                        <span className='text-white/20 text-[9px] font-bold uppercase'>Member Since</span>
                        <span className='text-white/60 text-xs font-bold'>April 2026</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfileView