import type { ChatEntity } from '@/domains/chat/types'

export interface ChatRepository {
  getChats(): Promise<ChatEntity[]>
  saveChats(chats: ChatEntity[]): Promise<void>
}
