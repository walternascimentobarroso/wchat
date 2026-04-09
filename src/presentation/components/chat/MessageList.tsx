'use client'

import { Message } from '@/domains/chat/entities/Message'
import { MessageItem } from './MessageItem'
import { AutoScrollContainer } from './AutoScrollContainer'
import { TypingIndicator } from './TypingIndicator'
import { useChatStore } from '@/presentation/state/chatStore'

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  const { isTyping } = useChatStore()

  return (
    <AutoScrollContainer dependency={messages}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isTyping && (
          <div className="h-full flex items-center justify-center text-slate-400">
            No messages yet. Start the conversation!
          </div>
        )}

        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}

        {isTyping && <TypingIndicator />}
      </div>
    </AutoScrollContainer>
  )
}
