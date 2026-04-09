'use client'

import { Bot } from 'lucide-react'

export function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-in fade-in">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-200 dark:bg-slate-700">
        <Bot className="w-4 h-4 text-slate-600 dark:text-slate-300" />
      </div>

      {/* Typing dots */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg px-4 py-2">
        <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  )
}
