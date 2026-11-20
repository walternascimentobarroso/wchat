'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { useAuth } from '@/features/auth/components/AuthProvider'
import { LoginForm } from '@/features/auth/components/LoginForm'

export default function LoginPage() {
  const t = useTranslations('auth')
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user) router.replace('/')
  }, [user, router])

  return (
    <AuthLayout title={t('welcomeBack')} subtitle={t('loginSubtitle')}>
      <LoginForm />
    </AuthLayout>
  )
}
