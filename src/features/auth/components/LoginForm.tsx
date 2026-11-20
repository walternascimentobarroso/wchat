'use client'

import { Lock, Mail } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type React from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { AuthField } from './AuthField'

export function LoginForm() {
  const t = useTranslations('auth')

  // shortcut: layout only, no backend; wire to auth service when it exists
  const handleSubmit = (e: React.FormEvent) => e.preventDefault()

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
        autoComplete="current-password"
      />

      <div className="flex items-center gap-2">
        <input id="remember" type="checkbox" className="size-4 rounded border-input accent-primary" />
        <Label htmlFor="remember" className="font-normal text-muted-foreground">
          {t('rememberMe')}
        </Label>
      </div>

      <Button type="submit" className="h-11 w-full rounded-xl font-semibold active:scale-[0.98]">
        {t('signIn')}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t('noAccount')}{' '}
        <Link href="/register" className="font-medium text-link hover:underline">
          {t('signUp')}
        </Link>
      </p>
    </form>
  )
}
