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
      <div className="flex items-center justify-center h-full p-3 md:pr-3 md:py-3 md:pl-0">
        <div className="glass-panel rounded-2xl w-full h-full flex items-center justify-center">
          <EmptyState />
        </div>
      </div>
    )
  }

  const chatMessages = messages[selectedChatId] || []

  return (
    <div className="flex flex-col h-full p-3 md:pr-3 md:py-3 md:pl-0">
      <div className="glass-panel rounded-2xl flex flex-col flex-1 overflow-hidden">
        <ChatHeader />
        <MessageList messages={chatMessages} />
        <ChatInput />
      </div>
    </div>
  )
}
