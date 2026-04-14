const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export async function streamChatMessage(
  chatId: string,
  content: string,
  onToken: (token: string) => void
): Promise<void> {
  const response = await fetch(`${API_URL}/chat/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, content }),
  })

  if (!response.ok) throw new Error(`API error: ${response.status}`)
  if (!response.body) throw new Error('No response body')

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    onToken(decoder.decode(value, { stream: true }))
  }
}
