import type { Chat } from '../entities/Chat'

export function deleteChat(chats: Chat[], chatId: string): Chat[] {
  return chats.filter((chat) => chat.id !== chatId)
}
