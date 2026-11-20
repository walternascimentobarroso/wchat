'use client'

import { useTranslations } from 'next-intl'
import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { LoginForm } from '@/features/auth/components/LoginForm'

export default function LoginPage() {
  const t = useTranslations('auth')

  return (
    <AuthLayout title={t('welcomeBack')} subtitle={t('loginSubtitle')}>
      <LoginForm />
    </AuthLayout>
  )
}
