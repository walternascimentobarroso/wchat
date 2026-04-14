'use client'

import { Message } from '@/domains/chat/entities/Message'
import { MessageRole } from '@/domains/chat/types'
import { MarkdownRenderer } from './MarkdownRenderer'
import { CopyButton } from './CopyButton'
import { User, Sparkles } from 'lucide-react'

interface MessageItemProps {
  message: Message
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === MessageRole.USER

  return (
    <div className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-2xl flex items-center justify-center ${
          isUser
            ? 'bg-gradient-to-br from-violet-600 to-purple-700 dark:from-violet-500 dark:to-purple-600 shadow-md shadow-violet-500/25'
            : 'glass-chip'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 max-w-sm sm:max-w-md lg:max-w-2xl ${isUser ? 'items-end flex flex-col' : ''}`}>
        <div
          className={`inline-block rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'bg-gradient-to-br from-violet-600 to-purple-700 dark:from-violet-600 dark:to-purple-700 text-white rounded-tr-sm shadow-md shadow-violet-500/20'
              : 'glass-surface rounded-tl-sm text-slate-800 dark:text-slate-100'
          }`}
        >
          <MarkdownRenderer content={message.content} />
        </div>

        {!isUser && (
          <div className="mt-1.5 ml-1">
            <CopyButton text={message.content} />
          </div>
        )}
      </div>
    </div>
  )
}
