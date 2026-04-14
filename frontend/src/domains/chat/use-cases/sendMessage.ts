import { Message } from '../entities/Message'
import { MessageRole } from '../types'
import { generateId } from '@/shared/utils/id'

export function sendMessage(chatId: string, content: string): Message {
  return new Message(generateId(), chatId, MessageRole.USER, content, new Date())
}
