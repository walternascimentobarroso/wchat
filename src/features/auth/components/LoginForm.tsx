'use client'

import { Lock, Mail } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { DEMO_ACCOUNT } from '../services/authService'
import { AuthField } from './AuthField'
import { useAuth } from './AuthProvider'

export function LoginForm() {
  const t = useTranslations('auth')
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      login(email, password)
    } catch {
      setError(t('invalidCredentials'))
    }
  }

  const fillDemoAccount = () => {
    setEmail(DEMO_ACCOUNT.email)
    setPassword(DEMO_ACCOUNT.password)
    setError('')
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthField
          id="email"
          type="email"
          label={t('email')}
          icon={Mail}
          autoComplete="email"
          spellCheck={false}
          placeholder={t('emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthField
          id="password"
          type="password"
          label={t('password')}
          icon={Lock}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex items-center gap-2">
          <input
            id="remember"
            type="checkbox"
            className="size-4 rounded border-input accent-primary"
          />
          <Label htmlFor="remember" className="font-normal text-muted-foreground">
            {t('rememberMe')}
          </Label>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
          >
            {error}
          </p>
        )}

        <Button type="submit" className="h-11 w-full rounded-xl font-semibold active:scale-[0.98]">
          {t('signIn')}
        </Button>
      </form>

      <section aria-labelledby="demo-account" className="space-y-3">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          <h2 id="demo-account">{t('demoTryAs')}</h2>
          <span className="h-px flex-1 bg-border" />
        </div>
        <button
          type="button"
          onClick={fillDemoAccount}
          className="h-10 w-full rounded-xl border bg-card text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t('demoUser')}
        </button>
      </section>

      <p className="text-center text-sm text-muted-foreground">
        {t('noAccount')}{' '}
        <Link href="/register" className="font-medium text-link hover:underline">
          {t('signUp')}
        </Link>
      </p>
    </div>
  )
}
