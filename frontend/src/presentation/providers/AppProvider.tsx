'use client'

import { ReactNode } from 'react'
import { ThemeProvider } from './ThemeProvider'
import { TooltipProvider } from '@/components/ui/tooltip'

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ThemeProvider>
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </ThemeProvider>
  )
}
