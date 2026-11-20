'use client'

import { Lock, Mail, User } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AuthField } from './AuthField'

const MIN_PASSWORD_LENGTH = 8

export function RegisterForm() {
  const t = useTranslations('auth')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const mismatch = submitted && password !== confirmPassword

  // shortcut: layout only, no backend; wire to auth service when it exists
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <AuthField id="name" label={t('name')} icon={User} autoComplete="name" />
      <AuthField
        id="email"
        type="email"
        label={t('email')}
        icon={Mail}
        autoComplete="email"
        spellCheck={false}
        placeholder={t('emailPlaceholder')}
      />
      <AuthField
        id="password"
        type="password"
        label={t('password')}
        icon={Lock}
        autoComplete="new-password"
        minLength={MIN_PASSWORD_LENGTH}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <AuthField
        id="confirmPassword"
        type="password"
        label={t('confirmPassword')}
        icon={Lock}
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        aria-invalid={mismatch}
        aria-describedby={mismatch ? 'password-error' : undefined}
      />

      {mismatch && (
        <p
          id="password-error"
          role="alert"
          className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {t('passwordMismatch')}
        </p>
      )}

      <Button type="submit" className="h-11 w-full rounded-xl font-semibold active:scale-[0.98]">
        {t('signUp')}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t('hasAccount')}{' '}
        <Link href="/login" className="font-medium text-link hover:underline">
          {t('signIn')}
        </Link>
      </p>
    </form>
  )
}
