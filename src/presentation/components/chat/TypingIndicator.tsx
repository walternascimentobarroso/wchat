'use client'

import { Sparkles } from 'lucide-react'

export function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-in fade-in">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-2xl flex items-center justify-center bg-gradient-to-br from-indigo-500/10 to-violet-500/10 dark:from-indigo-400/15 dark:to-violet-400/15 backdrop-blur-sm border border-violet-200/40 dark:border-violet-500/15 shadow-sm">
        <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
      </div>

      {/* Typing dots */}
      <div className="flex items-center gap-1.5 bg-white/75 dark:bg-white/5 backdrop-blur-sm border border-white/50 dark:border-violet-500/12 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="w-2 h-2 bg-violet-400 dark:bg-violet-500 rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-violet-400 dark:bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
        <div className="w-2 h-2 bg-violet-400 dark:bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
      </div>
    </div>
  )
}
