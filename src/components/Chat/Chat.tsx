'use client'
import React, { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ChatHeader from './ChatHeader'
import MessageArea from './MessageArea'
import ChatInput from './ChatInput'
import UserProfileView from '../Chat/UserProfileView'

const ChatComponent = ({ activeChat: propActiveChat, onBack }: any) => {
  const searchParams = useSearchParams();
  const [activeChat, setActiveChat] = useState(propActiveChat);
  const [showProfile, setShowProfile] = useState(false);
  const [ setRefreshTrigger] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [myId, setMyId] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMyId(localStorage.getItem("userid"));
    }
  }, []);

  useEffect(() => {
    const view = searchParams.get('view');
    const userId = searchParams.get('userId');
    const username = searchParams.get('username');

    if (view === 'profile' && userId && username) {
      setActiveChat({ 
        id: userId, 
        username: username, 
        name: username 
      });
      setShowProfile(true);
    } else {
      setActiveChat(propActiveChat);
      if (propActiveChat?.isNew) {
        setShowProfile(true);
      } else {
        setShowProfile(false);
      }
    }
  }, [searchParams, propActiveChat]);

  useEffect(() => {
    if (activeChat?.id && myId) {
      const otherUserId = Number(activeChat.id);
      const currentUserId = Number(myId);
      const roomId = currentUserId < otherUserId ? `${currentUserId}_${otherUserId}` : `${otherUserId}_${currentUserId}`;

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
  }, [activeChat, myId]);

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
            <MessageArea activeChat={activeChat} messages={messages} />
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

const Chat = (props: any) => {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center text-[#BA9EFF]">Loading chat...</div>}>
      <ChatComponent {...props} />
    </Suspense>
  )
}

export default Chat