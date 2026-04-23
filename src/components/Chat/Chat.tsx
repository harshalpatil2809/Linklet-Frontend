'use client'
import React, { useState, useEffect } from 'react'
import ChatHeader from './ChatHeader'
import MessageArea from './MessageArea'
import ChatInput from './ChatInput'
import UserProfileView from '../Chat/UserProfileView' // Naya component

const Chat = ({ activeChat, onBack }: any) => {
  const [showProfile, setShowProfile] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleMessageSent = () => {
    // Isse useEffect trigger hoga MessageArea mein
    setRefreshTrigger(prev => prev + 1);
  };
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
            <MessageArea activeChat={activeChat} key={refreshTrigger}/>
            <ChatInput activeChat={activeChat} onMessageSent={handleMessageSent}/>
          </>
        )}
      </div>
    </main>
  )
}

export default Chat