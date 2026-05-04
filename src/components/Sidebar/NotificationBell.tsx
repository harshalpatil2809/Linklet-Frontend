'use client'
import React, { useState, useEffect, useRef } from 'react'
import API from '@/lib/axios'

interface Notification {
  id: number | string;
  sender_username: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
  message?: string; 
}

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [myId, setMyId] = useState<string | null>(null);
  
  const ws = useRef<WebSocket | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMyId(localStorage.getItem('userid'));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await API.get('/api/notification/history/');
      setNotifications(response.data);
      const unread = response.data.filter((n: Notification) => !n.is_read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (myId) {
      fetchHistory();

      const isProduction = process.env.NODE_ENV === 'production';
      const wsBaseUrl = isProduction
        ? 'wss://linklet-backend-efe3.onrender.com'
        : 'ws://127.0.0.1:8000';

      const wsUrl = `${wsBaseUrl}/ws/notifications/${myId}/`;
      ws.current = new WebSocket(wsUrl);

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        const newNotif = {
          id: Date.now(),
          sender_username: data.sender_username,
          notification_type: data.notification_type,
          is_read: false,
          created_at: new Date().toISOString(),
          message: data.message
        };

        setNotifications((prev) => [newNotif, ...prev]);
        setUnreadCount((prev) => prev + 1);
      };

      return () => {
        if (ws.current) {
          ws.current.close();
        }
      };
    }
  }, [myId]);

  const markAsRead = async () => {
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      markAsRead();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={handleToggle}
        className="relative p-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/5"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
        </svg>

        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#BA9EFF] text-[10px] font-bold text-black">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl border border-white/10 bg-[#16141A] shadow-2xl z-50 overflow-hidden">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0D0B0F]">
            <h3 className="font-semibold text-white">Notifications</h3>
          </div>
          
          <div className="max-h-100 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-white/40 text-sm">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors flex gap-3 ${!notif.is_read ? 'bg-white/2' : ''}`}
                >
                  <div className="h-10 w-10 rounded-full bg-[#BA9EFF]/20 flex items-center justify-center shrink-0 text-[#BA9EFF] font-bold uppercase">
                    {notif.sender_username.charAt(0)}
                  </div>
                  <div className="flex flex-col flex-1">
                    <p className="text-sm text-white/90 leading-tight">
                      <span className="font-semibold">{notif.sender_username}</span> 
                      {notif.notification_type === 'follow_request' ? ' started following you.' : ' sent you a notification.'}
                    </p>
                    <span className="text-[11px] text-white/40 mt-1">
                      {new Date(notif.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {!notif.is_read && (
                    <div className="h-2 w-2 rounded-full bg-[#BA9EFF] mt-1"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell