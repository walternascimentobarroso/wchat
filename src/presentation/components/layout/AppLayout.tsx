'use client'

import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { ChatContainer } from './ChatContainer'

interface AppLayoutProps {
  children?: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-white dark:bg-slate-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main chat area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <ChatContainer />
      </main>

      {children}
    </div>
  )
}
