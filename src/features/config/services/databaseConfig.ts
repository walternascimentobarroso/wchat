import { readFile, writeFile } from 'node:fs/promises'

export type DatabaseConfig = {
  host: string
  port: number
  user: string
  password: string
  database: string
}

export type PublicDatabaseConfig = Omit<DatabaseConfig, 'password'> & { hasPassword: boolean }

const EMPTY_CONFIG: DatabaseConfig = { host: '', port: 3306, user: '', password: '', database: '' }

function configPath(): string {
  const path = process.env.MYSQL_CONFIG_FILE
  if (!path) throw new Error('MYSQL_CONFIG_FILE is not set')
  return path
}

async function read(): Promise<DatabaseConfig> {
  const raw = await readFile(configPath(), 'utf-8').catch(() => null)
  return raw ? { ...EMPTY_CONFIG, ...JSON.parse(raw) } : EMPTY_CONFIG
}

async function readPublic(): Promise<PublicDatabaseConfig> {
  const { password, ...config } = await read()
  return { ...config, hasPassword: password !== '' }
}

// An empty password keeps the saved one, so the form never needs to receive it.
async function save(update: DatabaseConfig): Promise<void> {
  const current = await read()
  const config = { ...update, password: update.password || current.password }
  await writeFile(configPath(), JSON.stringify(config, null, 2), { mode: 0o600 })
}

export const databaseConfig = { read: readPublic, save }
