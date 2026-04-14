import { Message } from '../entities/Message'
import { MessageRole } from '../types'
import { generateId } from '@/shared/utils/id'
import { getRandomFakeResponse } from '@/shared/constants/fakeResponses'

export async function generateFakeResponse(chatId: string, userMessage: string): Promise<Message> {
  // Simulate thinking/typing time (1-2 seconds)
  const delay = 1000 + Math.random() * 1000
  await new Promise((resolve) => setTimeout(resolve, delay))

  const responseContent = getRandomFakeResponse(userMessage)

  return new Message(generateId(), chatId, MessageRole.ASSISTANT, responseContent, new Date())
}
