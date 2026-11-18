'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { chatService, PROVIDERS, type Provider } from '../services/chatService'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  error?: boolean
}

const STORAGE_KEY = 'wchat.conversation'
const PROVIDER_KEY = 'wchat.provider'

function loadProvider(): Provider {
  try {
    const saved = localStorage.getItem(PROVIDER_KEY)
    return PROVIDERS.find((provider) => provider === saved) ?? PROVIDERS[0]
  } catch {
    return PROVIDERS[0]
  }
}

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
  const [provider, setProvider] = useState<Provider>(PROVIDERS[0])

  useEffect(() => {
    setProvider(loadProvider())
    setMessages(loadMessages())
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) saveMessages(messages)
  }, [messages, loaded])

  const changeProvider = (next: Provider) => {
    setProvider(next)
    try {
      localStorage.setItem(PROVIDER_KEY, next)
    } catch {}
  }

  const send = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || typing) return

    const userMessage = createMessage('user', trimmed)
    const history = [...messages, userMessage]
      .filter((message) => !message.error)
      .map(({ role, text }) => ({ role, content: text }))
    setMessages((current) => [...current, userMessage])
    setTyping(true)
    try {
      const reply = await chatService.send(provider, history)
      setMessages((current) => [...current, createMessage('assistant', reply)])
    } catch {
      setMessages((current) => [
        ...current,
        { ...createMessage('assistant', t('error')), error: true },
      ])
    } finally {
      setTyping(false)
    }
  }

  const clear = () => setMessages([])

  return { messages, loaded, typing, send, clear, provider, changeProvider }
}
