'use client'

import { type AbstractIntlMessages, NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from '@/components/theme/ThemeProvider'

export function Providers({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode
  locale: string
  messages: AbstractIntlMessages
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
        {children}
      </NextIntlClientProvider>
    </ThemeProvider>
  )
}
