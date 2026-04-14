import { useEffect, useRef } from 'react'

/**
 * Hook to auto-scroll an element to the bottom when dependency changes
 * Usage: useAutoScroll(messages.length) - pass a dependency that changes
 */
export function useAutoScroll(dependency?: unknown) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
      }, 0)
    }
  }, [dependency])

  return scrollRef
}
