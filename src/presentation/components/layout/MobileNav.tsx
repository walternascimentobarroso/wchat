'use client'

import { MessageSquare, Plus, Moon, Sun } from 'lucide-react'
import { useChatStore } from '@/presentation/state/chatStore'
import { useTheme } from 'next-themes'

export function MobileNav() {
  const { createChat } = useChatStore()
  const { theme, resolvedTheme, setTheme } = useTheme()

  const isDark = (theme === 'system' ? resolvedTheme : theme) === 'dark'

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-white/20 dark:border-violet-500/10 px-6 py-2 flex items-center justify-around" suppressHydrationWarning>
      <button className="flex flex-col items-center gap-1 p-2 text-violet-600 dark:text-violet-400">
        <MessageSquare className="w-5 h-5" />
        <span className="text-[10px] font-medium">Chats</span>
      </button>

      <button
        onClick={() => createChat()}
        className="flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-600 dark:bg-violet-500 text-white shadow-lg shadow-violet-500/30 hover:bg-violet-700 transition-all duration-200 hover:scale-105 -translate-y-3"
      >
        <Plus className="w-5 h-5" />
      </button>

      <button
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className="flex flex-col items-center gap-1 p-2 text-slate-500 dark:text-slate-400"
      >
        {isDark
          ? <Sun className="w-5 h-5 text-amber-400" />
          : <Moon className="w-5 h-5 text-violet-500" />
        }
        <span className="text-[10px] font-medium">Theme</span>
      </button>
    </nav>
  )
}
