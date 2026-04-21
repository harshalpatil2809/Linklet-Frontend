'use client'
import React, { useState, useEffect } from 'react'
import ChatHeader from './ChatHeader'
import MessageArea from './MessageArea'
import ChatInput from './ChatInput'
import UserProfileView from '../Chat/UserProfileView' // Naya component

const Chat = ({ activeChat, onBack }: any) => {
  const [showProfile, setShowProfile] = useState(false);

  // Jab bhi activeChat badle, check karein ki kya ye ek search result hai
  useEffect(() => {
    if (activeChat?.isNew) {
      setShowProfile(true);
    } else {
      setShowProfile(false);
    }
  }, [activeChat]);

  if (!activeChat) return <div className="flex-1 flex items-center justify-center text-white/20">Select a chat</div>;

  return (
    <main className='flex-1 flex flex-col h-screen bg-[#0D0B0F] relative'>
      <ChatHeader activeChat={activeChat} onBack={onBack} onShowProfile={() => setShowProfile(!showProfile)} />
      
      <div className="flex-1 relative overflow-hidden flex flex-col">
        {showProfile ? (
          <UserProfileView user={activeChat} />
        ) : (
          <>
            <MessageArea activeChat={activeChat} />
            <ChatInput activeChat={activeChat} />
          </>
        )}
      </div>
    </main>
  )
}

export default Chat