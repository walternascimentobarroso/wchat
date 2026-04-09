'use client'

import { Trash2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChatStore } from '@/presentation/state/chatStore'

export function ChatHeader() {
  const { chats, selectedChatId, deleteChat } = useChatStore()

  const currentChat = chats.find((chat) => chat.id === selectedChatId)

  const handleDelete = () => {
    if (selectedChatId && window.confirm('Delete this chat?')) {
      deleteChat(selectedChatId)
    }
  }

  return (
    <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between border-b border-white/50 dark:border-violet-500/12 bg-white/30 dark:bg-violet-950/20">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm shadow-violet-500/25">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate leading-tight">
            {currentChat?.title || 'Chat'}
          </h1>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 dark:bg-emerald-500" />
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Online</p>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        className="text-slate-400 hover:text-red-500 hover:bg-red-50/60 dark:hover:bg-red-950/30 rounded-xl transition-all duration-200"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
}
