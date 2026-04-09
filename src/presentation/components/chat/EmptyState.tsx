'use client'

import { MessageSquare } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <MessageSquare className="w-8 h-8 text-slate-400 dark:text-slate-600" />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          No chat selected
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Create a new chat or select one from the sidebar to get started
        </p>
      </div>
    </div>
  )
}
