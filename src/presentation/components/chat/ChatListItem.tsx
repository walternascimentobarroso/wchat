'use client'

import { Chat } from '@/domains/chat/entities/Chat'
import { useChatStore } from '@/presentation/state/chatStore'
import { Button } from '@/components/ui/button'

interface ChatListItemProps {
  chat: Chat
  isSelected: boolean
}

export function ChatListItem({ chat, isSelected }: ChatListItemProps) {
  const { selectChat } = useChatStore()

  return (
    <Button
      variant={isSelected ? 'default' : 'ghost'}
      onClick={() => selectChat(chat.id)}
      className={`w-full justify-start text-left truncate ${
        isSelected
          ? 'bg-blue-600 hover:bg-blue-700 text-white'
          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
      }`}
    >
      <span className="truncate">{chat.title}</span>
    </Button>
  )
}
