import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'

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

const MAX_TOOL_ROUNDS = 6
const DATABASE_PROMPT =
  'You can query the MySQL database through tools. Use them to answer questions about tables, columns and data. ' +
  'Inspect the schema (list_tables, describe_table) before writing queries, and always use LIMIT. ' +
  "Answer in the user's language."

type ProviderConfig = (typeof PROVIDERS)[keyof typeof PROVIDERS]
type ChatMessage = { role: 'user' | 'assistant'; content: string }
type ToolCall = { id: string; function: { name: string; arguments: string } }
type CompletionMessage = { role: 'assistant'; content: string | null; tool_calls?: ToolCall[] }
type OpenAiTool = {
  type: 'function'
  function: { name: string; description?: string; parameters: unknown }
}

function isChatMessage(value: unknown): value is ChatMessage {
  const message = value as ChatMessage
  return (
    (message?.role === 'user' || message?.role === 'assistant') &&
    typeof message.content === 'string'
  )
}

async function connectDatabaseTools(): Promise<Client | null> {
  if (!process.env.MCP_URL) return null
  const client = new Client({ name: 'wchat', version: '0.1.0' })
  await client.connect(new StreamableHTTPClientTransport(new URL(process.env.MCP_URL)))
  return client
}

async function listOpenAiTools(mcp: Client): Promise<OpenAiTool[]> {
  const { tools } = await mcp.listTools()
  return tools.map((tool) => ({
    type: 'function',
    function: { name: tool.name, description: tool.description, parameters: tool.inputSchema },
  }))
}

// Errors go back to the model as text so it can fix the query instead of failing the chat.
async function runTool(mcp: Client, call: ToolCall): Promise<string> {
  try {
    const output = await mcp.callTool({
      name: call.function.name,
      arguments: JSON.parse(call.function.arguments || '{}'),
    })
    return JSON.stringify(output.content)
  } catch (error) {
    return `Error: ${error instanceof Error ? error.message : String(error)}`
  }
}

async function complete(
  config: ProviderConfig,
  messages: unknown[],
  tools: OpenAiTool[]
): Promise<CompletionMessage> {
  const upstream = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.apiKey}` },
    body: JSON.stringify({
      model: config.model,
      messages,
      ...(tools.length > 0 && { tools }),
    }),
  })
  if (!upstream.ok) throw new Error(`${upstream.status}: ${await upstream.text()}`)
  const completion = await upstream.json()
  return completion.choices?.[0]?.message ?? { role: 'assistant', content: '' }
}

async function answer(config: ProviderConfig, history: ChatMessage[]): Promise<string> {
  const mcp = await connectDatabaseTools()
  try {
    const tools = mcp ? await listOpenAiTools(mcp) : []
    const messages: unknown[] = mcp
      ? [{ role: 'system', content: DATABASE_PROMPT }, ...history]
      : [...history]

    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const message = await complete(config, messages, tools)
      if (!mcp || !message.tool_calls?.length) return message.content ?? ''
      messages.push(message)
      for (const call of message.tool_calls) {
        messages.push({ role: 'tool', tool_call_id: call.id, content: await runTool(mcp, call) })
      }
    }
    return 'Too many database lookups for one question. Please narrow it down.'
  } finally {
    await mcp?.close()
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const config = PROVIDERS[body?.provider as keyof typeof PROVIDERS]
  if (!config) return Response.json({ error: 'Unknown provider' }, { status: 400 })
  if (!Array.isArray(body.messages) || !body.messages.every(isChatMessage)) {
    return Response.json({ error: 'Invalid messages' }, { status: 400 })
  }
  if (!config.apiKey) return Response.json({ error: 'Missing API key' }, { status: 500 })

  try {
    return Response.json({ reply: await answer(config, body.messages) })
  } catch (error) {
    console.error(`${body.provider}:`, error)
    return Response.json({ error: 'Provider error' }, { status: 502 })
  }
}
