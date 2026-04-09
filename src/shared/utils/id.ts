// Simple ID generator - could be replaced with nanoid if needed
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
