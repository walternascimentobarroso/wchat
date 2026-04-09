export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export interface ChatEntity {
  id: string
  title: string
  createdAt: Date
}

export interface MessageEntity {
  id: string
  chatId: string
  role: MessageRole
  content: string
  createdAt: Date
}
