/**
 * Format a date for display in chat
 */
export function formatChatDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()

  // Within last minute
  if (diff < 60000) {
    return 'now'
  }

  // Within last hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes}m ago`
  }

  // Today
  if (isSameDay(date, now)) {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  // Yesterday
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (isSameDay(date, yesterday)) {
    return 'yesterday'
  }

  // This week
  if (diff < 604800000) {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'short',
    })
  }

  // Default: show date
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function isSameDay(date1: Date, date2: Date): boolean {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}
