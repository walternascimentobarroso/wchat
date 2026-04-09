import type { MessageEntity } from '../types'
import { MessageRole } from '../types'

export class Message implements MessageEntity {
  id: string
  chatId: string
  role: MessageRole
  content: string
  createdAt: Date

  constructor(
    id: string,
    chatId: string,
    role: MessageRole,
    content: string,
    createdAt: Date = new Date()
  ) {
    this.id = id
    this.chatId = chatId
    this.role = role
    this.content = content
    this.createdAt = createdAt
  }

  static fromDTO(dto: MessageEntity): Message {
    return new Message(dto.id, dto.chatId, dto.role, dto.content, new Date(dto.createdAt))
  }

  toDTO(): MessageEntity {
    return {
      id: this.id,
      chatId: this.chatId,
      role: this.role,
      content: this.content,
      createdAt: this.createdAt,
    }
  }

  isUserMessage(): boolean {
    return this.role === MessageRole.USER
  }

  isAssistantMessage(): boolean {
    return this.role === MessageRole.ASSISTANT
  }
}
