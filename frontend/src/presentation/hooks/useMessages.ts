import { useMemo } from 'react'
import { useChatStore } from '../state/chatStore'

/**
 * Hook to access messages for a specific chat
 * Provides memoized list to prevent unnecessary re-renders
 */
export function useMessages(chatId: string | null) {
  const { messages } = useChatStore()

  return useMemo(() => {
    if (!chatId) return []
    return messages[chatId] || []
  }, [messages, chatId])
}
