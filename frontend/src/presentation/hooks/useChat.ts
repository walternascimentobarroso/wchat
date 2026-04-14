import { useMemo } from 'react'
import { useChatStore } from '../state/chatStore'

/**
 * Hook to access current chat and related actions
 * Provides easier access to chat-specific store slices
 */
export function useChat() {
  const { chats, selectedChatId, createChat, deleteChat, selectChat } = useChatStore()

  const currentChat = useMemo(() => {
    return chats.find((chat) => chat.id === selectedChatId)
  }, [chats, selectedChatId])

  return {
    chats,
    currentChat,
    selectedChatId,
    createChat,
    deleteChat,
    selectChat,
  }
}
