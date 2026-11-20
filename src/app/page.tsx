'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { useAuth } from '@/features/auth/components/AuthProvider'
import { ChatInput } from '@/features/chat/components/ChatInput'
import { MessageList } from '@/features/chat/components/MessageList'
import { useConversation } from '@/features/chat/hooks/useConversation'

export default function ChatPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) router.replace('/login')
  }, [isLoading, user, router])

  if (!user) return null

  return <Chat />
}

function Chat() {
  const { messages, loaded, typing, send, clear, provider, changeProvider } = useConversation()

  return (
    <div className="flex h-dvh flex-col">
      <Topbar
        onClear={clear}
        canClear={messages.length > 0}
        provider={provider}
        onProviderChange={changeProvider}
      />
      <MessageList messages={messages} loaded={loaded} typing={typing} />
      <ChatInput onSend={send} disabled={typing} />
    </div>
  )
}
