'use client'

import { Topbar } from '@/components/layout/Topbar'
import { ChatInput } from '@/features/chat/components/ChatInput'
import { MessageList } from '@/features/chat/components/MessageList'
import { useConversation } from '@/features/chat/hooks/useConversation'

export default function ChatPage() {
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
