'use client'

import { ArrowLeft, ChevronDown, Database } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { useAuth } from '@/features/auth/components/AuthProvider'
import { DatabaseConfigForm } from '@/features/config/components/DatabaseConfigForm'

export default function ConfigPage() {
  const t = useTranslations('config')
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) router.replace('/login')
  }, [user, isLoading, router])

  if (!user) return null

  return (
    <main className="mx-auto w-full max-w-2xl space-y-6 px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        {t('backToChat')}
      </Link>
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </header>

      <details className="group rounded-2xl border bg-card" open>
        <summary className="flex cursor-pointer list-none items-center gap-3 p-4 [&::-webkit-details-marker]:hidden">
          <Database className="size-5 text-muted-foreground" aria-hidden />
          <span className="flex-1">
            <span className="block font-medium">{t('databaseSection')}</span>
            <span className="block text-sm text-muted-foreground">{t('databaseSectionHint')}</span>
          </span>
          <ChevronDown
            className="size-4 transition-transform group-open:rotate-180 motion-reduce:transition-none"
            aria-hidden
          />
        </summary>
        <div className="border-t p-4">
          <DatabaseConfigForm />
        </div>
      </details>
    </main>
  )
}
