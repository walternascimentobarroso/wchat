'use client'

import { Moon, Sun, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PROVIDERS, type Provider } from '@/features/chat/services/chatService'

interface TopbarProps {
  onClear: () => void
  canClear: boolean
  provider: Provider
  onProviderChange: (provider: Provider) => void
}

export function Topbar({ onClear, canClear, provider, onProviderChange }: TopbarProps) {
  const t = useTranslations()
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <header className="flex h-[72px] shrink-0 items-center gap-2 border-b px-4 md:px-6">
      <Image src="/icon.svg" alt="" width={28} height={28} />
      <span className="font-semibold">{t('app.title')}</span>
      <div className="ml-auto flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" aria-label={t('chat.provider')}>
              <span className="text-xs font-semibold capitalize">{provider}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {PROVIDERS.map((option) => (
              <DropdownMenuItem
                key={option}
                onClick={() => onProviderChange(option)}
                className={`capitalize ${provider === option ? 'bg-accent' : ''}`}
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" disabled={!canClear} className="gap-1.5">
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              {t('chat.clear')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('chat.clearTitle')}</DialogTitle>
              <DialogDescription>{t('chat.clearDescription')}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{t('chat.cancel')}</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="destructive" onClick={onClear}>
                  {t('chat.confirm')}
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <LanguageSwitcher />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="h-10 w-10 rounded-xl"
        >
          <Sun
            className="h-4 w-4 rotate-0 scale-100 transition-transform motion-reduce:transition-none dark:-rotate-90 dark:scale-0"
            aria-hidden="true"
          />
          <Moon
            className="absolute h-4 w-4 rotate-90 scale-0 transition-transform motion-reduce:transition-none dark:rotate-0 dark:scale-100"
            aria-hidden="true"
          />
          <span className="sr-only">{t('theme.toggle')}</span>
        </Button>
      </div>
    </header>
  )
}
