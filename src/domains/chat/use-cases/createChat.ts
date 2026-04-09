import { Chat } from '../entities/Chat'
import { generateId } from '@/shared/utils/id'

export function createChat(title?: string): Chat {
  const id = generateId()
  const finalTitle = title?.trim() || `Chat ${new Date().toLocaleDateString()}`
  return new Chat(id, finalTitle, new Date())
}
