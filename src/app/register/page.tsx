'use client'

import { useTranslations } from 'next-intl'
import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { RegisterForm } from '@/features/auth/components/RegisterForm'

export default function RegisterPage() {
  const t = useTranslations('auth')

  return (
    <AuthLayout title={t('createAccount')} subtitle={t('registerSubtitle')}>
      <RegisterForm />
    </AuthLayout>
  )
}
