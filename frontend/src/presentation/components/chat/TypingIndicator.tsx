'use client'

import { Sparkles } from 'lucide-react'

export function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-in fade-in">
      <div className="flex-shrink-0 w-8 h-8 rounded-2xl glass-chip flex items-center justify-center">
        <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
      </div>
      <div className="glass-surface rounded-2xl rounded-tl-sm flex items-center gap-1.5 px-4 py-3">
        <div className="w-2 h-2 bg-violet-400 dark:bg-violet-500 rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-violet-400 dark:bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
        <div className="w-2 h-2 bg-violet-400 dark:bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
      </div>
    </div>
  )
}
