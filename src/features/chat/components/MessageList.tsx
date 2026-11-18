'use client'

import { Bot, Check, Copy } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Button } from '@/components/ui/button'
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

function CopyButton({ text }: { text: string }) {
  const t = useTranslations('chat')
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-7 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
      onClick={copy}
      aria-label={copied ? t('copied') : t('copy')}
      title={copied ? t('copied') : t('copy')}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </Button>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('group flex gap-2', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && <AssistantAvatar />}
      <div className={cn('flex max-w-[85%] flex-col gap-1', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'max-w-full break-words rounded-2xl px-4 py-2 text-sm',
            isUser
              ? 'whitespace-pre-wrap bg-primary text-primary-foreground'
              : 'prose prose-sm dark:prose-invert bg-muted prose-pre:overflow-x-auto'
          )}
        >
          {isUser ? message.text : <Markdown remarkPlugins={[remarkGfm]}>{message.text}</Markdown>}
        </div>
        <CopyButton text={message.text} />
      </div>
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
