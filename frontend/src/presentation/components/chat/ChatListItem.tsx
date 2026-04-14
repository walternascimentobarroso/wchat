'use client'

import { Chat } from '@/domains/chat/entities/Chat'
import { useChatStore } from '@/presentation/state/chatStore'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'

interface ChatListItemProps {
  chat: Chat
  isSelected: boolean
}

export function ChatListItem({ chat, isSelected }: ChatListItemProps) {
  const { selectChat } = useChatStore()

  return (
    <Button
      variant="ghost"
      onClick={() => selectChat(chat.id)}
      className={`w-full justify-start text-left truncate rounded-xl transition-all duration-200 gap-2.5 ${
        isSelected
          ? 'bg-gradient-to-r from-violet-600/90 to-purple-600/90 hover:from-violet-600 hover:to-purple-600 text-white shadow-md shadow-violet-500/20'
          : 'text-slate-600 dark:text-slate-400 hover:bg-white/55 dark:hover:bg-violet-500/10 hover:text-violet-700 dark:hover:text-violet-300'
      }`}
    >
      <MessageCircle className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'}`} />
      <span className="truncate text-sm">{chat.title}</span>
    </Button>
  )
}
