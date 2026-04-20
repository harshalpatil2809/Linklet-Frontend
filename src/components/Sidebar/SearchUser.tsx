'use client'
import React from 'react'
import { Search } from 'lucide-react'

const SearchUser = () => {
    return (
        <div className='px-6 mb-6'>
            <div className='relative group'>
                {/* Search Icon */}
                <div className='absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#BA9EFF] transition-colors duration-300'>
                    <Search size={20} />
                </div>

                {/* Input Field */}
                <input
                    type="text"
                    placeholder="Search people..."
                    className='w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-[#BA9EFF]/40 focus:ring-4 focus:ring-[#BA9EFF]/5 transition-all duration-300 placeholder:text-white/20 outline-none'
                />

                {/* Glow Effect Background */}
                <div className='absolute inset-0 -z-10 bg-[#BA9EFF] opacity-0 group-focus-within:opacity-5 blur-xl transition-opacity duration-500 rounded-2xl'></div>
            </div>
        </div>
    )
}

export default SearchUser