'use client'
import React, { useState } from 'react'
import { Toaster } from "@/components/ui/sonner"
import Sidebar from '@/components/Sidebar/Sidebar'
import Chat from '@/components/Chat/Chat'

const DashboardPage = () => {
  const [activeChat, setActiveChat] = useState<any>(null);

  return (
    <div className='bg-[#0F0D11] h-screen w-full text-white flex overflow-hidden font-sans relative'>
      <Toaster position="top-right" richColors />

      {/* Sidebar - Mobile par full width agar chat select nahi hai, Desktop par 30% */}
      <div className={`
        ${activeChat ? 'hidden md:flex' : 'flex'} 
        w-full md:w-[20%] min-w-[320px] border-r border-white/5 h-full
      `}>
        <Sidebar onChatSelect={setActiveChat} activeChatId={activeChat?.id} />
      </div>

      {/* Chat Section - Mobile par full width agar chat select hai, Desktop par 70% */}
      <div className={`
        ${!activeChat ? 'hidden md:flex' : 'flex'} 
        w-full md:w-[80%] flex flex-col h-full
      `}>
        <Chat activeChat={activeChat} onBack={() => setActiveChat(null)} />
      </div>
    </div>
  )
}

export default DashboardPage