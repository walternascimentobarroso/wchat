'use client'

import { Message } from '@/domains/chat/entities/Message'
import { MessageRole } from '@/domains/chat/types'
import { MarkdownRenderer } from './MarkdownRenderer'
import { CopyButton } from './CopyButton'
import { MessageCircle, Bot } from 'lucide-react'

interface MessageItemProps {
  message: Message
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === MessageRole.USER

  return (
    <div className={`flex gap-3 animate-in fade-in ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-blue-600 dark:bg-blue-500'
            : 'bg-slate-200 dark:bg-slate-700'
        }`}
      >
        {isUser ? (
          <MessageCircle className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 max-w-md lg:max-w-2xl ${isUser ? 'text-right' : ''}`}>
        <div
          className={`inline-block rounded-lg px-4 py-2 ${
            isUser
              ? 'bg-blue-600 text-white dark:bg-blue-700'
              : 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
          }`}
        >
          <MarkdownRenderer content={message.content} />
        </div>

        {!isUser && (
          <div className="mt-2">
            <CopyButton text={message.content} />
          </div>
        )}
      </div>
    </div>
  )
}
