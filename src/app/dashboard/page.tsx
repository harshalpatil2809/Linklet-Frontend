'use client'
import React, { useState } from 'react'
import { Toaster } from "@/components/ui/sonner"
import Sidebar from '@/components/Sidebar/Sidebar'
import Chat from '@/components/Chat/Chat'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'


const DashboardPage = () => {
  const [activeChat, setActiveChat] = useState<any>(null);
  const router = useRouter()
  const token = Cookies.get('access')

  if (!token){
    router.push('/login')
  }

  return (
    <div className='flex h-screen bg-[#0F0D11]'>
      <Sidebar 
        onChatSelect={(user: any) => setActiveChat(user)} // <-- Yeh function pass hona chahiye
        activeChatId={activeChat?.id} 
      />
      <Chat activeChat={activeChat} onBack={() => setActiveChat(null)} />
    </div>
  )
}

export default DashboardPage