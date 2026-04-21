'use client'

import React, { useState, useEffect } from 'react'
import { Search, Loader2, UserPlus } from 'lucide-react'
import API from '@/lib/axios'

interface SearchUserProps {
    onChatSelect: (user: any) => void;
}

const SearchUser = ({ onChatSelect }: SearchUserProps) => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const searchPeople = async () => {
            // Agar query 2 characters se kam hai toh search mat karo
            if (query.trim().length < 2) {
                setResults([])
                setIsOpen(false)
                return
            }

            setLoading(true)
            try {
                // Backend API call: q parameter ke saath
                const res = await API.get(`/api/profiles/search/?q=${query}`)
                setResults(res.data)
                setIsOpen(true)
            } catch (err) {
                console.error("Search failed:", err)
                setResults([])
            } finally {
                setLoading(false)
            }
        }

        // Debounce Logic: User ke rukne ke 500ms baad API call hogi
        const timeoutId = setTimeout(searchPeople, 500)
        return () => clearTimeout(timeoutId)
    }, [query])

    return (
        <div className='px-6 mb-6 relative z-50'>
            <div className='relative group'>
                {/* Search Icon / Loader */}
                <div className='absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#BA9EFF] transition-colors duration-300'>
                    {loading ? (
                        <Loader2 size={18} className="animate-spin text-[#BA9EFF]" />
                    ) : (
                        <Search size={20} />
                    )}
                </div>

                {/* Input Field */}
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    placeholder="Find new friends..."
                    className='w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-[#BA9EFF]/40 focus:ring-4 focus:ring-[#BA9EFF]/5 transition-all duration-300 placeholder:text-white/10 outline-none text-white'
                />

                {/* Aesthetic Glow */}
                <div className='absolute inset-0 -z-10 bg-[#BA9EFF] opacity-0 group-focus-within:opacity-5 blur-xl transition-opacity duration-500 rounded-2xl'></div>
            </div>

            {/* Results Dropdown */}
            {isOpen && query.length >= 2 && (
                <div className='absolute left-6 right-6 top-full mt-3 bg-[#131116] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200'>
                    <div className='p-2 max-h-72 overflow-y-auto custom-scrollbar'>
                        {results.length > 0 ? (
                            results.map((user: any) => (
                                <div
                                    key={user.id}
                                    onClick={() => {
                                        onChatSelect({
                                            id: user.id,
                                            name: user.username,
                                            isOnline: user.is_online,
                                            isNew: true, // Flag to show Profile View instead of Chat
                                            isFollowing: user.is_following,
                                            bio: user.bio || "Available on Linklet"
                                        })
                                        setQuery('')
                                        setIsOpen(false)
                                    }}
                                    className='flex items-center gap-4 p-3 hover:bg-[#BA9EFF]/10 rounded-2xl cursor-pointer transition-all group/item'
                                >
                                    {/* Small Avatar */}
                                    <div className='w-11 h-11 rounded-full bg-gradient-to-tr from-[#BA9EFF] to-[#43237A] flex items-center justify-center text-black font-bold text-sm border-2 border-white/5'>
                                        {user.username[0].toUpperCase()}
                                    </div>

                                    {/* User Details */}
                                    <div className='flex-1 min-w-0'>
                                        <h4 className='text-sm font-bold text-white truncate group-hover/item:text-[#BA9EFF] transition-colors'>
                                            {user.username}
                                        </h4>
                                        <p className='text-[10px] text-white/30 uppercase tracking-tighter'>
                                            View profile
                                        </p>
                                    </div>

                                    {/* Quick Action Icon */}
                                    <div className='text-white/10 group-hover/item:text-[#BA9EFF] transition-colors'>
                                        <UserPlus size={18} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='p-8 text-center'>
                                <p className='text-xs text-white/20 font-bold uppercase tracking-[0.2em]'>
                                    No users found
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Dropdown Footer */}
                    <div className='bg-white/5 p-3 text-center border-t border-white/5'>
                        <p className='text-[9px] text-white/20 font-bold uppercase tracking-widest'>
                            Search Results for "{query}"
                        </p>
                    </div>
                </div>
            )}

            {/* Click outside to close (Invisible Backdrop) */}
            {isOpen && (
                <div
                    className='fixed inset-0 z-[-1]'
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </div>
    )
}

export default SearchUser