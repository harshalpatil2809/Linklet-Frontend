
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Smile, Loader2 } from 'lucide-react'
import API from '@/lib/axios'
import EmojiPicker, { Theme } from 'emoji-picker-react'
import { toast } from 'sonner'

interface ChatInputProps {
    activeChat: {
        id: number
        username: string
    } | null
    onMessageSent: () => void
    sendMessage: (messageText: string) => void
}

const ChatInput = ({
    activeChat,
    onMessageSent,
    sendMessage,
}: ChatInputProps) => {
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [showEmoji, setShowEmoji] = useState(false)

    const emojiRef = useRef<HTMLDivElement>(null)

    // Close the emoji picker when the user clicks outside it.
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                emojiRef.current &&
                !emojiRef.current.contains(event.target as Node)
            ) {
                setShowEmoji(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    // Send the message through WebSocket and persist it through the API.
    const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const trimmedMessage = message.trim()

        if (!trimmedMessage || !activeChat?.id || loading) return

        setLoading(true)

        try {
            sendMessage(trimmedMessage)

            await API.post(`/api/messaging/send/${activeChat.id}/`, {
                text: trimmedMessage,
            })

            setMessage('')
            setShowEmoji(false)
            onMessageSent()
        } catch (error) {
            console.error('Message sending failed:', error)
            toast.error('Unable to send message. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    // Append the selected emoji to the current message.
    const handleEmojiClick = (emojiData: { emoji: string }) => {
        setMessage((previousMessage) => previousMessage + emojiData.emoji)
    }

    const canSend = Boolean(message.trim() && activeChat && !loading)

    return (
        <footer className="relative shrink-0 bg-[#0f0f0f] px-4 py-4 md:px-6">



            <form
                onSubmit={handleSend}
                className="mx-auto flex w-full max-w-6xl items-center gap-3"
            >

                {/* Message Input and Emoji Picker */}
                <div className="relative flex min-w-0 flex-1 items-center">

                    {/* Combined Emoji + Input Container */}
                    <div className="flex h-12 w-full items-center rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-input-bg)] transition-[border-color,box-shadow] duration-[var(--transition-ui)] ">

                        {/* Emoji Button */}
                        <button
                            type="button"
                            onClick={() => setShowEmoji((previous) => !previous)}
                            disabled={!activeChat || loading}
                            aria-label={showEmoji ? 'Close emoji picker' : 'Open emoji picker'}
                            aria-expanded={showEmoji}
                            className={`ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-[var(--transition-ui)] disabled:cursor-not-allowed disabled:opacity-40 ${showEmoji
                                    ? 'text-(--color-primary)'
                                    : 'text-(--color-text-subtle) hover:text-[var(--color-text)]'
                                }`}
                        >
                            <Smile size={20} />
                        </button>

                        {/* Message Input */}
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={!activeChat || loading}
                            placeholder={
                                activeChat
                                    ? 'Type your message...'
                                    : 'Select a chat to start...'
                            }
                            aria-label="Type your message"
                            className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-subtle)] disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    {/* Emoji Picker Popup */}
                    {showEmoji && (
                        <div
                            ref={emojiRef}
                            className="absolute bottom-full left-0 z-50 mb-3"
                        >
                            <EmojiPicker
                                onEmojiClick={handleEmojiClick}
                                theme={Theme.DARK}
                                skinTonesDisabled
                                searchDisabled={false}
                            />
                        </div>
                    )}
                </div>


                {/* Send Button */}
                <button
                    type="submit"
                    disabled={!canSend}
                    aria-label="Send message"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-[var(--color-primary)] text-[var(--color-primary-text)] shadow-[var(--shadow-button)] transition-[background-color,transform,opacity] duration-[var(--transition-ui)] hover:bg-[var(--color-primary-hover)] active:scale-95 disabled:cursor-not-allowed disabled:bg-[var(--color-surface-hover)] disabled:text-[var(--color-text-subtle)] disabled:shadow-none"
                >
                    {loading ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : (
                        <Send size={19} />
                    )}
                </button>
            </form>

        </footer>
    )
}

export default ChatInput
