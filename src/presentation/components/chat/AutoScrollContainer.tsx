'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface AutoScrollContainerProps {
  children: ReactNode
  dependency?: unknown
}

export function AutoScrollContainer({ children, dependency }: AutoScrollContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      // Scroll to bottom with a small delay to ensure DOM is updated
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
      }, 0)
    }
  }, [dependency])

  return <div ref={scrollRef} className="flex flex-col h-full overflow-y-auto">
    {children}
  </div>
}
