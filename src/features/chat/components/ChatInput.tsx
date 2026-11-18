'use client'

import { SendHorizontal } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { type FormEvent, type KeyboardEvent, useState } from 'react'
import { Button } from '@/components/ui/button'

interface ChatInputProps {
  onSend: (text: string) => void
  disabled: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const t = useTranslations('chat')
  const [text, setText] = useState('')
  const canSend = !disabled && text.trim().length > 0

  const submit = () => {
    if (!canSend) return
    onSend(text)
    setText('')
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    submit()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return
    event.preventDefault()
    submit()
  }

  return (
    <form onSubmit={handleSubmit} className="border-t bg-background">
      <div className="mx-auto flex max-w-3xl items-end gap-2 px-4 py-3">
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('placeholder')}
          aria-label={t('placeholder')}
          rows={1}
          className="field-sizing-content max-h-40 min-h-10 flex-1 resize-none rounded-xl border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button type="submit" size="icon" disabled={!canSend} className="size-10 rounded-xl">
          <SendHorizontal className="size-4" aria-hidden="true" />
          <span className="sr-only">{t('send')}</span>
        </Button>
      </div>
    </form>
  )
}
