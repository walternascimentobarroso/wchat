'use client'

import { useRef, useState, useCallback } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useChatStore } from '@/presentation/state/chatStore'

export function ChatInput() {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { sendMessage, selectedChatId, isTyping } = useChatStore()

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || !selectedChatId || isTyping) {
      return
    }

    await sendMessage(input)
    setInput('')

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [input, selectedChatId, sendMessage, isTyping])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter, but allow Shift+Enter for newline
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)

    // Auto-grow textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }

  return (
    <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-950">
      <div className="flex gap-3">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Message..."
          className="resize-none min-h-12 max-h-48 rounded-lg dark:bg-slate-900 dark:border-slate-700"
          disabled={!selectedChatId || isTyping}
        />

        <Button
          onClick={handleSendMessage}
          disabled={!input.trim() || !selectedChatId || isTyping}
          size="icon"
          className="h-12 w-12 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
