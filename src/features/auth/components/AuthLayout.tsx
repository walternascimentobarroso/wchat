'use client'

import { Bot, Languages, MessageSquare, Moon, Sparkles, Sun } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import type React from 'react'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Button } from '@/components/ui/button'

const FEATURES = [
  { key: 'models', icon: Bot },
  { key: 'history', icon: MessageSquare },
  { key: 'languages', icon: Languages },
] as const

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: React.ReactNode
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  const t = useTranslations()
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:48px_48px]">
      <header className="flex items-center justify-between px-4 py-4 sm:px-8">
        <span className="flex items-center gap-2 font-semibold">
          <Image src="/icon.svg" alt="" width={28} height={28} />
          {t('app.title')}
        </span>
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="size-4 dark:hidden" aria-hidden />
            <Moon className="hidden size-4 dark:block" aria-hidden />
            <span className="sr-only">{t('theme.toggle')}</span>
          </Button>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="login-enter grid w-full max-w-5xl overflow-hidden glass rounded-2xl lg:grid-cols-2">
          <aside className="relative hidden min-h-[600px] lg:block">
            <Image
              src="/images/login-hero.webp"
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 512px, 0px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
            <div className="absolute inset-x-0 bottom-0 space-y-6 p-10 text-white">
              <p className="text-3xl font-semibold leading-tight tracking-tight">
                {t('auth.heroLine1')}
                <br />
                <span className="text-primary">{t('auth.heroHighlight')}</span>{' '}
                {t('auth.heroLine2')}
              </p>
              <ul className="space-y-3">
                {FEATURES.map(({ key, icon: Icon }) => (
                  <li key={key} className="flex items-center gap-3 text-sm">
                    <span className="flex size-8 items-center justify-center rounded-full bg-white text-black">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    {t(`auth.features.${key}`)}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <section className="flex flex-col justify-center px-6 py-10 sm:px-12">
            <div className="mb-8 space-y-3 text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary-soft text-link">
                <Sparkles className="size-5" aria-hidden />
              </span>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
            {children}
          </section>
        </div>
      </main>

      <footer className="px-4 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {t('app.title')}
      </footer>
    </div>
  )
}
