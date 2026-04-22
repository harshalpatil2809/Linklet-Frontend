'use client'
import React, { useState, useEffect } from 'react'
import { Toaster } from "@/components/ui/sonner"
import Sidebar from '@/components/Sidebar/Sidebar'
import Chat from '@/components/Chat/Chat'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import MyProfileView from '@/components/Chat/MyProfileView'

const DashboardPage = () => {
  const [mounted, setMounted] = useState(false) // Hydration fix ke liye
  const [activeChat, setActiveChat] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'chat' | 'my-profile'>('chat')
  const router = useRouter()

  // 1. Ensure karein ki component client par mount ho gaya hai
  useEffect(() => {
    setMounted(true)
    const token = Cookies.get('access')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  // 2. Jab tak mount na ho, kuch render na karein (Server-Client sync)
  if (!mounted) return null

  // 3. Render logic (Ab hydration mismatch nahi hoga)
  return (
    <div className='flex h-screen w-full bg-[#0F0D11] overflow-hidden'>
      <Toaster position='top-right' expand={false} richColors />

      {/* Sidebar Section */}
      <div className={`w-full md:w-[30%] lg:w-[25%] border-r border-white/5 ${activeChat && viewMode === 'chat' ? 'hidden md:block' : 'block'}`}>
        <Sidebar
          onChatSelect={(user: any) => {
            setActiveChat(user);
            setViewMode('chat');
          }}
          onProfileClick={() => {
            setViewMode('my-profile');
            setActiveChat(null);
          }}
          activeChatId={activeChat?.id}
        />
      </div>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col h-full ${!activeChat && viewMode === 'chat' ? 'hidden md:flex' : 'flex'}`}>
        {viewMode === 'my-profile' ? (
          <MyProfileView />
        ) : (
          <Chat 
            activeChat={activeChat} 
            onBack={() => setActiveChat(null)} 
          />
        )}
      </main>
    </div>
  )
}

export default DashboardPage