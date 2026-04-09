import type { ChatRepository } from '@/infrastructure/storage/ChatRepository'
import type { Chat } from '../entities/Chat'
import type { ChatEntity } from '../types'

export async function persistChats(repository: ChatRepository, chats: Chat[]): Promise<void> {
  const dtos = chats.map((chat) => chat.toDTO() as ChatEntity)
  await repository.saveChats(dtos)
}
