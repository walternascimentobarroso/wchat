import type { ChatRepository } from '@/infrastructure/storage/ChatRepository'
import { Chat } from '../entities/Chat'
import { Message } from '../entities/Message'
import * as createChatsUC from '../use-cases/createChat'
import * as deleteChatsUC from '../use-cases/deleteChat'
import * as sendMessageUC from '../use-cases/sendMessage'
import * as generateFakeResponseUC from '../use-cases/generateFakeResponse'
import * as loadChatsUC from '../use-cases/loadChats'
import * as persistChatsUC from '../use-cases/persistChats'

export class ChatService {
  constructor(private repository: ChatRepository) {}

  createChat(title?: string): Chat {
    return createChatsUC.createChat(title)
  }

  deleteChat(chats: Chat[], chatId: string): Chat[] {
    return deleteChatsUC.deleteChat(chats, chatId)
  }

  sendMessage(chatId: string, content: string): Message {
    return sendMessageUC.sendMessage(chatId, content)
  }

  async generateFakeResponse(chatId: string, userMessage: string): Promise<Message> {
    return generateFakeResponseUC.generateFakeResponse(chatId, userMessage)
  }

  async loadChats(): Promise<Chat[]> {
    return loadChatsUC.loadChats(this.repository)
  }

  async persistChats(chats: Chat[]): Promise<void> {
    return persistChatsUC.persistChats(this.repository, chats)
  }
}
