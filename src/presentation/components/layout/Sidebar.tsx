'use client'

import { useEffect } from 'react'
import { Plus, MessageSquareText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ChatList } from '../chat/ChatList'
import { useChatStore } from '@/presentation/state/chatStore'
import { ThemeToggle } from './ThemeToggle'

export function Sidebar() {
  const { createChat, loadChats } = useChatStore()

  useEffect(() => {
    loadChats()
  }, [loadChats])

  return (
    <aside className="w-64 hidden md:flex flex-col">
      <div className="flex flex-col h-full glass border-r border-white/20 dark:border-violet-500/10 shadow-xl">
        {/* Header */}
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2.5 px-1 py-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 dark:from-violet-500 dark:to-purple-600 flex items-center justify-center shadow-md shadow-violet-500/25">
              <MessageSquareText className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-800 dark:text-slate-100 tracking-tight">wchat</span>
          </div>
          <Button
            onClick={() => createChat()}
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 dark:from-violet-500 dark:to-purple-500 text-white gap-2 rounded-xl shadow-md shadow-violet-500/20 transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/30 hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
        </div>

        <Separator className="bg-white/30 dark:bg-violet-500/10" />

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto px-2 py-3">
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2 mb-2">Recent</p>
          <ChatList />
        </div>

        <Separator className="bg-white/30 dark:bg-violet-500/10" />

        {/* Footer */}
        <div className="p-3">
          <ThemeToggle />
        </div>
      </div>
    </aside>
  )
}
