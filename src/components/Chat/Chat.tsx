'use client'
import React, { useState, useEffect, useRef } from 'react'
import ChatHeader from './ChatHeader'
import MessageArea from './MessageArea'
import ChatInput from './ChatInput'
import UserProfileView from '../Chat/UserProfileView'

const Chat = ({ activeChat, onBack }: any) => {
  const [showProfile, setShowProfile] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);
  const ws = useRef<WebSocket | null>(null);

  const myId = 1; 

  useEffect(() => {
    if (activeChat?.isNew) {
      setShowProfile(true);
    } else {
      setShowProfile(false);
    }

    if (activeChat?.id) {
      const otherUserId = activeChat.id;
      const roomId = myId < otherUserId ? `${myId}_${otherUserId}` : `${otherUserId}_${myId}`;

      const isProduction = process.env.NODE_ENV === 'production';
      const wsBaseUrl = isProduction
        ? 'wss://linklet-backend-efe3.onrender.com'
        : 'ws://localhost:8000';

      const wsUrl = `${wsBaseUrl}/ws/chat/${roomId}/`;
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log("WebSocket Connected for Room ID:", roomId);
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Naya Message Aaya:", data);
        setMessages((prev) => [...prev, data]);
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket Error:", error);
      };

      ws.current.onclose = () => {
        console.log("WebSocket Disconnected");
      };

      return () => {
        if (ws.current) {
          ws.current.close();
        }
      };
    }
  }, [activeChat]);

  const sendMessage = (messageText: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN && messageText.trim() !== '') {
      ws.current.send(JSON.stringify({
        message: messageText,
        sender_id: myId
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
            <MessageArea activeChat={activeChat} messages={messages} key={refreshTrigger} />
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