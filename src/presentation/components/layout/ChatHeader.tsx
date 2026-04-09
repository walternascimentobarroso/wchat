'use client'

import { Trash2 } from 'lucide-react'
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
    <div className="border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between bg-white dark:bg-slate-950">
      <h1 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
        {currentChat?.title || 'Chat'}
      </h1>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
}
