'use client'
import React, { useState, useEffect, useRef } from 'react'
import ChatHeader from './ChatHeader'
import MessageArea from './MessageArea'
import ChatInput from './ChatInput'
import UserProfileView from '../Chat/UserProfileView'

const Chat = ({ activeChat, onBack }: any) => {
  const [showProfile, setShowProfile] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Real-time messages state aur WebSocket ref
  const [messages, setMessages] = useState<any[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (activeChat?.isNew) {
      setShowProfile(true);
    } else {
      setShowProfile(false);
    }

    // Har naye chat/chatId ke liye WebSocket connect karein
    if (activeChat?.id) {
      const isProduction = process.env.NODE_ENV === 'production';

      const wsBaseUrl = isProduction
        ? 'wss://linklet-backend-efe3.onrender.com'
        : 'ws://localhost:8000';

      const wsUrl = `${wsBaseUrl}/ws/chat/${activeChat.id}/`;
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log("WebSocket Connected for Chat ID:", activeChat.id);
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("🟢 Naya Message Aaya:", data);
        setMessages((prev) => [...prev, data]);
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket Error:", error);
      };

      ws.current.onclose = () => {
        console.log("WebSocket Disconnected");
      };

      // Component unmount hone par connection close karein
      return () => {
        if (ws.current) {
          ws.current.close();
        }
      };
    }
  }, [activeChat]);

  // Message bhejne ka function
  const sendMessage = (messageText: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN && messageText.trim() !== '') {
      ws.current.send(JSON.stringify({
        message: messageText,
        sender_id: 1 // Yahan apna dynamic user ID (jaise auth user ka ID) dal sakte hain
      }));
    }
  };

  const handleMessageSent = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (!activeChat) return <div className="flex-1 flex items-center justify-center text-white/20">Select a chat</div>;

  return (
    <main className='flex-1 flex flex-col h-screen bg-[#0D0B0F] relative'>
      <ChatHeader
        activeChat={activeChat}
        onBack={onBack}
        onShowProfile={() => setShowProfile(!showProfile)}
      />

      <div className="flex-1 relative overflow-hidden flex flex-col">
        {showProfile ? (
          <UserProfileView user={activeChat} />
        ) : (
          <>
            {/* Messages pass karein taaki MessageArea real-time data read kare */}
            <MessageArea activeChat={activeChat} messages={messages} key={refreshTrigger} />

            {/* ChatInput mein sendMessage function pass karein */}
            <ChatInput
              activeChat={activeChat}
              onMessageSent={handleMessageSent}
              sendMessage={sendMessage}
            />
          </>
        )}
      </div>
    </main>
  )
}

export default Chat