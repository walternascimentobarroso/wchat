const PROVIDERS = {
  groq: {
    baseUrl: 'https://api.groq.com/openai/v1',
    model: 'openai/gpt-oss-120b',
    apiKey: process.env.GROQ_API_KEY,
  },
  gemini: {
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    model: 'gemini-3.8-flash',
    apiKey: process.env.GEMINI_API_KEY,
  },
}

type ChatMessage = { role: 'user' | 'assistant'; content: string }

function isChatMessage(value: unknown): value is ChatMessage {
  const message = value as ChatMessage
  return (
    (message?.role === 'user' || message?.role === 'assistant') &&
    typeof message.content === 'string'
  )
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const config = PROVIDERS[body?.provider as keyof typeof PROVIDERS]
  if (!config) return Response.json({ error: 'Unknown provider' }, { status: 400 })
  if (!Array.isArray(body.messages) || !body.messages.every(isChatMessage)) {
    return Response.json({ error: 'Invalid messages' }, { status: 400 })
  }
  if (!config.apiKey) return Response.json({ error: 'Missing API key' }, { status: 500 })

  const upstream = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.apiKey}` },
    body: JSON.stringify({ model: config.model, messages: body.messages }),
  })
  if (!upstream.ok) {
    console.error(`${body.provider} ${upstream.status}: ${await upstream.text()}`)
    return Response.json({ error: 'Provider error' }, { status: 502 })
  }

  const completion = await upstream.json()
  return Response.json({ reply: completion.choices?.[0]?.message?.content ?? '' })
}
