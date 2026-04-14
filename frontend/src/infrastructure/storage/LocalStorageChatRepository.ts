import type { ChatEntity } from '@/domains/chat/types'
import type { ChatRepository } from './ChatRepository'

const STORAGE_KEY = 'wchat:chats'

export class LocalStorageChatRepository implements ChatRepository {
  async getChats(): Promise<ChatEntity[]> {
    if (typeof window === 'undefined') {
      return []
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        return []
      }

      const data = JSON.parse(stored)
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error('Failed to load chats from localStorage:', error)
      return []
    }
  }

  async saveChats(chats: ChatEntity[]): Promise<void> {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(chats))
    } catch (error) {
      console.error('Failed to save chats to localStorage:', error)
    }
  }
}
