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
  const [refreshTrigger, setRefreshTrigger] = useState(0);
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
        username: decodeURIComponent(username),
        name: decodeURIComponent(username)
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
    if (!activeChat?.id || !myId) return;

    const currentUserId = Number(myId);
    const otherUserId = Number(activeChat.id);

    // Don't attempt a connection with invalid IDs.
    if (
      !Number.isInteger(currentUserId) ||
      !Number.isInteger(otherUserId) ||
      currentUserId <= 0 ||
      otherUserId <= 0 ||
      currentUserId === otherUserId
    ) {
      console.error("Invalid chat participant IDs:", {
        currentUserId,
        otherUserId,
      });
      return;
    }

    // Both users must calculate the same room ID.
    const roomId =
      currentUserId < otherUserId
        ? `${currentUserId}_${otherUserId}`
        : `${otherUserId}_${currentUserId}`;

    const wsBaseUrl =
      process.env.NEXT_PUBLIC_WS_URL ||
      (window.location.protocol === "https:"
        ? "wss://linklet-backend-efe3.onrender.com"
        : "ws://localhost:8001");

    const wsUrl = `${wsBaseUrl.replace(/\/$/, "")}/ws/chat/${roomId}/`;

    console.log("Connecting to chat WebSocket:", wsUrl);

    const socket = new WebSocket(wsUrl);
    ws.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected. Room ID:", roomId);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("New message received:", data);
        setMessages((prev) => [...prev, data]);
      } catch (error) {
        console.error("Invalid WebSocket message:", error);
      }
    };

    socket.onerror = () => {
      console.error(
        "WebSocket connection failed. Check the backend server, routing, and browser Network > WS."
      );
    };

    socket.onclose = (event) => {
      console.log("WebSocket closed:", {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
      });

      if (ws.current === socket) {
        ws.current = null;
      }
    };

    return () => {
      // Close only this effect's connection.
      if (
        socket.readyState === WebSocket.CONNECTING ||
        socket.readyState === WebSocket.OPEN
      ) {
        socket.close();
      }

      if (ws.current === socket) {
        ws.current = null;
      }
    };
  }, [activeChat?.id, myId]);


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
    </ Suspense>
  )
}

export default Chat