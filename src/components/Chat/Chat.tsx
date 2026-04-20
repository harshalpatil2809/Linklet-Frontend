'use client'
import React from 'react'
import ChatHeader from './ChatHeader'
import MessageArea from './MessageArea'
import ChatInput from './ChatInput'
import { TiMessages } from "react-icons/ti"

interface ChatProps {
  activeChat: any;
  onBack: () => void;
}

const Chat = ({ activeChat, onBack }: ChatProps) => {
  // 1. Agar koi chat select nahi hai toh Empty State dikhao
  if (!activeChat) {
    return (
      <div className='hidden md:flex flex-1 flex-col items-center justify-center bg-[#0D0B0F] p-10 text-center animate-in fade-in duration-700'>
        <div className='relative mb-8'>
          {/* Subtle Glow behind logo */}
          <div className='absolute inset-0 bg-[#BA9EFF] blur-[80px] opacity-10 animate-pulse'></div>
          <div className='relative bg-white/5 p-8 rounded-[3rem] border border-white/5'>
            <TiMessages size={80} className='text-[#BA9EFF]/20' />
          </div>
        </div>
        
        <h2 className='text-3xl font-black tracking-tighter text-white/80'>
          Your Space, <span className='text-[#BA9EFF]'>Connected.</span>
        </h2>
        <p className='text-white/30 mt-3 max-w-sm text-sm leading-relaxed font-medium'>
          Select a conversation from the sidebar to start chatting. 
          Linklet makes it effortless to stay in touch.
        </p>
      </div>
    )
  }

  // 2. Agar chat select hai toh Main Chat Window dikhao
  return (
    <main className='flex-1 flex flex-col h-screen bg-[#0D0B0F] relative overflow-hidden animate-in slide-in-from-right-4 duration-500'>
      
      {/* Top Header Section */}
      <ChatHeader activeChat={activeChat} onBack={onBack} />

      {/* Middle Message Area (Scrollable) */}
      <MessageArea activeChat={activeChat} />

      {/* Bottom Input Section */}
      <ChatInput />

      {/* Background Subtle Gradient for Depth */}
      <div className='absolute top-0 right-0 w-[500px] h-[500px] bg-[#BA9EFF]/5 blur-[120px] -z-10 pointer-events-none'></div>
    </main>
  )
}

export default Chat