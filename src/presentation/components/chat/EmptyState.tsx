'use client'

import { Sparkles, Zap, Code2, Lightbulb } from 'lucide-react'

const suggestions = [
  { icon: Lightbulb, label: 'Ask anything', desc: 'Get answers to any question' },
  { icon: Zap, label: 'Explore ideas', desc: 'Brainstorm and think together' },
  { icon: Code2, label: 'Get help with code', desc: 'Debug, review, or write code' },
]

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 text-center px-4 max-w-sm mx-auto w-full">
      {/* Orb */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 dark:from-violet-500 dark:via-purple-600 dark:to-indigo-700 flex items-center justify-center shadow-2xl shadow-violet-500/40">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
          <Sparkles className="w-10 h-10 text-white relative z-10" />
        </div>
        <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-xl scale-150 -z-10" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
          Start a conversation
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Create a new chat or select one from the sidebar
        </p>
      </div>

      <div className="flex flex-col gap-2.5 w-full">
        {suggestions.map(({ icon: Icon, label, desc }) => (
          <div
            key={label}
            className="glass-subtle rounded-2xl px-4 py-3 text-left flex items-center gap-3 cursor-default hover:bg-white/60 dark:hover:bg-violet-500/8 transition-all duration-200 hover:scale-[1.01]"
          >
            <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-500/15 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
