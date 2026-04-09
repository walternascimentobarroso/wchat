'use client'

import { useChatStore } from '@/presentation/state/chatStore'
import { ChatListItem } from './ChatListItem'

export function ChatList() {
  const { chats, selectedChatId } = useChatStore()

  if (chats.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
        No chats yet
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      {chats.map((chat) => (
        <ChatListItem
          key={chat.id}
          chat={chat}
          isSelected={selectedChatId === chat.id}
        />
      ))}
    </div>
  )
}
