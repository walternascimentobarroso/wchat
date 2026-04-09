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
    <div className="flex h-screen bg-transparent">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main chat area */}
      <main className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
        <ChatContainer />
      </main>

      {/* Mobile bottom nav */}
      <MobileNav />

      {children}
    </div>
  )
}
