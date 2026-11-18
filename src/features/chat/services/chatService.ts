export const PROVIDERS = ['groq', 'gemini'] as const
export type Provider = (typeof PROVIDERS)[number]

type ChatMessage = { role: 'user' | 'assistant'; content: string }

async function send(provider: Provider, messages: ChatMessage[]): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider, messages }),
  })
  if (!response.ok) throw new Error(`Chat request failed: ${response.status}`)
  const { reply } = await response.json()
  return reply
}

export const chatService = { send }
