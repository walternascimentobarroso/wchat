'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { chatService } from '../services/chatService'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
}

const STORAGE_KEY = 'wchat.conversation'

function loadMessages(): Message[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveMessages(messages: Message[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  } catch {
    // Storage unavailable (private mode, quota): keep the conversation in memory only.
  }
}

function createMessage(role: Message['role'], text: string): Message {
  return { id: crypto.randomUUID(), role, text }
}

export function useConversation() {
  const t = useTranslations('chat')
  const [messages, setMessages] = useState<Message[]>([])
  const [loaded, setLoaded] = useState(false)
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    setMessages(loadMessages())
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) saveMessages(messages)
  }, [messages, loaded])

  const send = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || typing) return

    setMessages((current) => [...current, createMessage('user', trimmed)])
    setTyping(true)
    try {
      const reply = await chatService.send(trimmed, t.raw('replies'))
      setMessages((current) => [...current, createMessage('assistant', reply)])
    } finally {
      setTyping(false)
    }
  }

  const clear = () => setMessages([])

  return { messages, loaded, typing, send, clear }
}
