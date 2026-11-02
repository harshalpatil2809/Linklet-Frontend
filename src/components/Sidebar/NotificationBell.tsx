'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Bell, CheckCheck, Loader2 } from 'lucide-react'
import API from '@/lib/axios'
import type { ChatItem } from './ChatList'

interface Notification {
  id: number | string
  sender_id: number | string
  sender_username: string
  notification_type: string
  is_read: boolean
  created_at: string
  message?: string
}

interface NotificationBellProps {
  onChatSelect: (user: ChatItem) => void
}

const formatTimestamp = (value: string) => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

const NotificationBell = ({
  onChatSelect,
}: NotificationBellProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [myId, setMyId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const ws = useRef<WebSocket | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Read the current user's ID after mounting.
  useEffect(() => {
    setMyId(localStorage.getItem('userid'))
  }, [])

  // Fetch notification history.
  const fetchHistory = useCallback(async () => {
    setLoading(true)

    try {
      const response = await API.get('/api/notification/history/')

      const data: Notification[] = Array.isArray(response.data)
        ? response.data
        : []

      setNotifications(data)
      setUnreadCount(
        data.filter((notification) => !notification.is_read).length
      )
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Connect to the notifications WebSocket.
  useEffect(() => {
    if (!myId) return

    void fetchHistory()

    const wsBaseUrl =
      process.env.NODE_ENV === 'production'
        ? 'wss://linklet-backend-efe3.onrender.com'
        : 'ws://127.0.0.1:8000'

    const socket = new WebSocket(
      `${wsBaseUrl}/ws/notifications/${encodeURIComponent(myId)}/`
    )

    ws.current = socket

    socket.onmessage = (event: MessageEvent<string>) => {
      try {
        const data: Partial<Notification> = JSON.parse(event.data)

        if (
          data.sender_id == null ||
          !data.sender_username ||
          !data.notification_type
        ) {
          return
        }

        const newNotification: Notification = {
          id: data.id ?? `${Date.now()}-${data.sender_id}`,
          sender_id: data.sender_id,
          sender_username: data.sender_username,
          notification_type: data.notification_type,
          is_read: false,
          created_at: data.created_at ?? new Date().toISOString(),
          message: data.message,
        }

        setNotifications((previous) => {
          if (previous.some((item) => item.id === newNotification.id)) {
            return previous
          }

          return [newNotification, ...previous]
        })

        setUnreadCount((previous) => previous + 1)
      } catch (error) {
        console.error('Invalid notification WebSocket message:', error)
      }
    }

    socket.onerror = (error) => {
      console.error('Notification WebSocket error:', error)
    }

    return () => {
      socket.onmessage = null
      socket.onerror = null
      socket.close()

      if (ws.current === socket) {
        ws.current = null
      }
    }
  }, [myId, fetchHistory])

  // Close when clicking outside or pressing Escape.
  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  // Mark notifications as read locally.
  // Connect this to your backend if you have a mark-read endpoint.
  const markAsRead = () => {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        is_read: true,
      }))
    )

    setUnreadCount(0)
  }

  const handleToggle = () => {
    setIsOpen((previous) => {
      const next = !previous

      if (next) {
        markAsRead()
      }

      return next
    })
  }

  const handleNotificationClick = (notification: Notification) => {
    setIsOpen(false)

    const senderId = Number(notification.sender_id)

    if (!Number.isFinite(senderId)) {
      console.error('Invalid notification sender ID:', notification.sender_id)
      return
    }

    const chat: ChatItem = {
      id: senderId,
      name: notification.sender_username,
      lastMsg: notification.message || 'No messages yet',
      time: formatTimestamp(notification.created_at),
      unread: 0,
      isOnline: false,
    }

    onChatSelect(chat)
  }

  return (
    <div ref={dropdownRef} className="relative">
      {/* Notification Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : 'Notifications'
        }
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-(--color-text-muted) transition-colors hover:border-(--color-border) hover:bg-(--color-surface) hover:text-(--color-text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary)"
      >
        <Bell size={20} strokeWidth={1.8} />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full border-2 border-(--color-bg) bg-(--color-primary) px-1 text-[10px] font-bold text-(--color-primary-text)">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (

        <section
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 z-50 mt-3 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 bg-[#080B09] backdrop-blur-3xl shadow-[0_16px_48px_rgba(0,0,0,0.65)]"
        >

          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-[#080B09] px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Notifications
              </h2>

              <p className="mt-0.5 text-xs text-white/65">
                Your latest activity
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAsRead}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-(--color-primary) transition-colors hover:bg-white/6"
              >
                <CheckCheck size={14} />
                Mark read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-[min(420px,65vh)] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center gap-2 px-4 py-10 text-sm text-white/65">
                <Loader2
                  size={17}
                  className="animate-spin text-(--color-primary)"
                />
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center px-5 py-10 text-center">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/4">
                  <Bell size={19} className="text-white/60" />
                </div>

                <p className="text-sm font-medium text-white/90">
                  All caught up
                </p>

                <p className="mt-1 text-xs text-white/65">
                  You don&apos;t have any notifications yet.
                </p>
              </div>
            ) : (
              notifications.map((notification) => {
                const isUnread = !notification.is_read

                const description =
                  notification.message ||
                  (notification.notification_type === 'follow_request'
                    ? 'started following you.'
                    : notification.notification_type === 'message'
                      ? 'sent you a message.'
                      : 'sent you a notification.')

                return (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => handleNotificationClick(notification)}
                    className={`flex w-full items-start gap-3 border-b border-white/8 px-4 py-3.5 text-left transition-colors last:border-b-0 hover:bg-white/6 ${isUnread ? 'bg-white/4' : 'bg-transparent'
                      }`}
                  >
                    {/* Sender Avatar */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/6 text-sm font-semibold text-(--color-primary)">
                      {notification.sender_username.charAt(0).toUpperCase()}
                    </div>

                    {/* Notification Content */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-5 text-white/70">
                        <span className="font-semibold text-white">
                          {notification.sender_username}
                        </span>{' '}
                        {description}
                      </p>

                      <p className="mt-1.5 text-[11px] text-white/60">
                        {formatTimestamp(notification.created_at)}
                      </p>
                    </div>

                    {isUnread && (
                      <span
                        aria-label="Unread"
                        className="mt-2 h-2 w-2 shrink-0 rounded-full bg-(--color-primary)"
                      />
                    )}
                  </button>
                )
              })
            )}
          </div>
        </section>
      )}
    </div>
  )
}

export default NotificationBell
