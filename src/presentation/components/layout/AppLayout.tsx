'use client'

import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { ChatContainer } from './ChatContainer'
import { MobileNav } from './MobileNav'

interface AppLayoutProps {
  children?: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-dvh bg-transparent relative overflow-hidden p-3 sm:p-4 md:p-6">

      {/* ── Background orbs ─────────────────────────────────────────────
          These are the colorful blobs that the glass panels blur through.
          Without them, backdrop-filter has nothing interesting to show.
      ──────────────────────────────────────────────────────────────── */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Top-left: violet */}
        <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-violet-400/30 dark:bg-violet-600/20 blur-[100px]" />
        {/* Top-right: indigo */}
        <div className="absolute -top-16 right-0 w-[420px] h-[420px] rounded-full bg-indigo-400/25 dark:bg-indigo-500/18 blur-[90px]" />
        {/* Bottom-center: purple */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[360px] rounded-full bg-purple-400/20 dark:bg-purple-700/18 blur-[110px]" />
        {/* Bottom-right: pink accent */}
        <div className="absolute -bottom-16 -right-16 w-[300px] h-[300px] rounded-full bg-fuchsia-400/15 dark:bg-fuchsia-600/12 blur-[80px]" />
      </div>

      <div className="glass-frame w-full max-w-6xl mx-auto rounded-[32px] overflow-hidden">
        <div className="flex min-h-[calc(100dvh-24px)] sm:min-h-[calc(100dvh-32px)] md:min-h-[calc(100dvh-48px)]">

          {/* Desktop Sidebar */}
          <Sidebar />

          {/* Main chat area */}
          <main className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
            <ChatContainer />
          </main>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />

      {children}
    </div>
  )
}
