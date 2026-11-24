import { type DatabaseConfig, databaseConfig } from '@/features/config/services/databaseConfig'

const MAX_PORT = 65535

function parseConfig(value: unknown): DatabaseConfig | null {
  const body = value as Record<string, unknown> | null
  const port = Number(body?.port)
  const fields = ['host', 'user', 'password', 'database'] as const
  if (!body || !fields.every((field) => typeof body[field] === 'string')) return null
  if (!Number.isInteger(port) || port < 1 || port > MAX_PORT) return null
  if (!body.host || !body.user) return null
  return {
    host: String(body.host).trim(),
    port,
    user: String(body.user).trim(),
    password: String(body.password),
    database: String(body.database).trim(),
  }
}

// shortcut: no server-side auth (login is a localStorage demo); protect this route when real auth exists
export async function GET() {
  return Response.json(await databaseConfig.read())
}

export async function POST(request: Request) {
  const config = parseConfig(await request.json().catch(() => null))
  if (!config) return Response.json({ error: 'Invalid config' }, { status: 400 })
  await databaseConfig.save(config)
  return Response.json(await databaseConfig.read())
}
