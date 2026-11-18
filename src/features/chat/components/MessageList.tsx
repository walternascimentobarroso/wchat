'use client'

import { Bot } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Message } from '../hooks/useConversation'

interface MessageListProps {
  messages: Message[]
  loaded: boolean
  typing: boolean
}

function AssistantAvatar() {
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
      <Bot className="size-4" aria-hidden="true" />
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex gap-2', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && <AssistantAvatar />}
      <p
        className={cn(
          'max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2 text-sm',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}
      >
        {message.text}
      </p>
    </div>
  )
}

function TypingIndicator() {
  const t = useTranslations('chat')

  return (
    <div className="flex gap-2" role="status">
      <AssistantAvatar />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-9 w-40 rounded-2xl" />
        <span className="text-xs text-muted-foreground">{t('typing')}</span>
      </div>
    </div>
  )
}

export function MessageList({ messages, loaded, typing }: MessageListProps) {
  const t = useTranslations('chat')
  const endRef = useRef<HTMLDivElement>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll must follow every new message and the typing indicator
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, typing])

  const isEmpty = loaded && messages.length === 0 && !typing

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-6" aria-live="polite">
        {isEmpty && (
          <div className="flex flex-col items-center gap-3 pt-24 text-center text-muted-foreground">
            <AssistantAvatar />
            <p>{t('greeting')}</p>
          </div>
        )}
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {typing && <TypingIndicator />}
        <div ref={endRef} />
      </div>
    </main>
  )
}
