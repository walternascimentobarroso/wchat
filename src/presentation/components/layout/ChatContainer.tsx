'use client'

import { useChatStore } from '@/presentation/state/chatStore'
import { ChatHeader } from './ChatHeader'
import { ChatInput } from './ChatInput'
import { MessageList } from '../chat/MessageList'
import { EmptyState } from '../chat/EmptyState'

export function ChatContainer() {
  const { selectedChatId, messages } = useChatStore()

  if (!selectedChatId) {
    return (
      <div className="flex items-center justify-center h-full bg-transparent">
        <EmptyState />
      </div>
    )
  }

  const chatMessages = messages[selectedChatId] || []

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <ChatHeader />

      {/* Messages */}
      <MessageList messages={chatMessages} />

      {/* Input */}
      <ChatInput />
    </div>
  )
}
