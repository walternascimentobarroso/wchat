'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()

  const isDark = (theme === 'system' ? resolvedTheme : theme) === 'dark'

  return (
    <div suppressHydrationWarning>
      <Button
        variant="ghost"
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className="w-full justify-start gap-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-700 dark:hover:text-violet-300 transition-all duration-200 text-sm"
      >
        {isDark
          ? <Sun className="w-4 h-4 text-amber-400" />
          : <Moon className="w-4 h-4 text-violet-500" />
        }
        {isDark ? 'Light mode' : 'Dark mode'}
      </Button>
    </div>
  )
}
