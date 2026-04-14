import type { ChatEntity } from '../types'

export class Chat implements ChatEntity {
  id: string
  title: string
  createdAt: Date

  constructor(id: string, title: string, createdAt: Date = new Date()) {
    this.id = id
    this.title = title
    this.createdAt = createdAt
  }

  static fromDTO(dto: ChatEntity): Chat {
    return new Chat(dto.id, dto.title, new Date(dto.createdAt))
  }

  toDTO(): ChatEntity {
    return {
      id: this.id,
      title: this.title,
      createdAt: this.createdAt,
    }
  }
}
