import type { ChatRepository } from '@/infrastructure/storage/ChatRepository'
import { Chat } from '../entities/Chat'
import type { ChatEntity } from '../types'

export async function loadChats(repository: ChatRepository): Promise<Chat[]> {
  const dtos = await repository.getChats()
  return dtos.map((dto) => Chat.fromDTO(dto as ChatEntity))
}
