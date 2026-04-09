'use client'

import { useEffect, useState } from 'react'
import { Plus, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { ChatList } from '../chat/ChatList'
import { useChatStore } from '@/presentation/state/chatStore'
import { ThemeToggle } from './ThemeToggle'

export function Sidebar() {
  const [isMobile, setIsMobile] = useState(false)
  const { createChat, loadChats } = useChatStore()

  // Load chats on mount
  useEffect(() => {
    loadChats()
  }, [loadChats])

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="p-4 space-y-3">
        <Button
          onClick={() => createChat()}
          className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 gap-2"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      <Separator className="dark:bg-slate-800" />

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        <ChatList />
      </div>

      <Separator className="dark:bg-slate-800" />

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <ThemeToggle />
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger className="fixed top-4 left-4 z-40 md:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
          <Menu className="w-5 h-5" />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">{sidebarContent}</SheetContent>
      </Sheet>
    )
  }

  return <aside className="w-64 hidden md:flex flex-col">{sidebarContent}</aside>
}
