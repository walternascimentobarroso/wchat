'use client'

import { useRef, useState, useCallback } from 'react'
import { Send, Mic } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useChatStore } from '@/presentation/state/chatStore'

export function ChatInput() {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { sendMessage, selectedChatId, isTyping } = useChatStore()

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || !selectedChatId || isTyping) return
    await sendMessage(input)
    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [input, selectedChatId, sendMessage, isTyping])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }

  return (
    <div className="px-4 py-3 border-t border-white/50 dark:border-violet-500/12 bg-white/20 dark:bg-violet-950/10">
      <div className="max-w-3xl mx-auto space-y-2">
        {/* Input row */}
        <div className="glass-chip rounded-2xl px-3 py-2 flex gap-2 items-end focus-within:border-violet-400/60 dark:focus-within:border-violet-500/40 focus-within:shadow-[0_0_0_3px_rgba(139,92,246,0.12)] transition-all duration-200">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            className="flex-1 resize-none min-h-[40px] max-h-48 border-0 bg-transparent shadow-none focus-visible:ring-0 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-slate-200 py-1.5 px-0 text-sm leading-relaxed"
            disabled={!selectedChatId || isTyping}
          />
          <div className="flex items-center gap-1.5 pb-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-xl text-slate-400 hover:text-violet-500 hover:bg-violet-100/60 dark:hover:bg-violet-500/12 transition-all duration-200 flex-shrink-0"
              disabled={!selectedChatId}
            >
              <Mic className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || !selectedChatId || isTyping}
              size="icon"
              className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:from-slate-200 disabled:to-slate-200 dark:disabled:from-slate-700 dark:disabled:to-slate-700 text-white flex-shrink-0 shadow-sm shadow-violet-500/25 transition-all duration-200 hover:shadow-md hover:shadow-violet-500/35 hover:scale-105 disabled:scale-100"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
        <p className="text-center text-[10px] text-slate-400 dark:text-slate-500">
          wchat can make mistakes. Double-check important information.
        </p>
      </div>
    </div>
  )
}
