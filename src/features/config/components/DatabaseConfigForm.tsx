'use client'

import { Database, Hash, Lock, Server, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type React from 'react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AuthField } from '@/features/auth/components/AuthField'
import type { PublicDatabaseConfig } from '../services/databaseConfig'

type Status = 'idle' | 'saving' | 'saved' | 'error'

export function DatabaseConfigForm() {
  const t = useTranslations('config')
  const [config, setConfig] = useState<PublicDatabaseConfig | null>(null)
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    fetch('/api/config')
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then(setConfig)
      .catch(() => setStatus('error'))
  }, [])

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setStatus('saving')
    const response = await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    })
    if (!response.ok) return setStatus('error')
    setConfig(await response.json())
    setStatus('saved')
    ;(form.elements.namedItem('password') as HTMLInputElement).value = ''
  }

  const message = status === 'saved' || status === 'error'

  if (!config) {
    if (status === 'error') {
      return (
        <p role="alert" className="text-sm text-destructive">
          {t('error')}
        </p>
      )
    }
    return <Skeleton className="h-80 w-full" />
  }

  return (
    <form onSubmit={save} className="space-y-5">
      <AuthField id="host" name="host" label={t('host')} icon={Server} defaultValue={config.host} />
      <AuthField
        id="port"
        name="port"
        type="number"
        min={1}
        max={65535}
        label={t('port')}
        icon={Hash}
        defaultValue={config.port}
      />
      <AuthField id="user" name="user" label={t('user')} icon={User} defaultValue={config.user} />
      <AuthField
        id="password"
        name="password"
        type="password"
        label={t('password')}
        icon={Lock}
        autoComplete="new-password"
        required={!config.hasPassword}
        placeholder={config.hasPassword ? t('passwordKept') : ''}
      />
      <AuthField
        id="database"
        name="database"
        label={t('database')}
        icon={Database}
        required={false}
        defaultValue={config.database}
      />
      <p className="text-sm text-muted-foreground">{t('readOnlyNote')}</p>
      {message && (
        <p
          role="status"
          className={
            status === 'saved' ? 'text-sm text-muted-foreground' : 'text-sm text-destructive'
          }
        >
          {t(status)}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={status === 'saving'}>
        {t('save')}
      </Button>
    </form>
  )
}
