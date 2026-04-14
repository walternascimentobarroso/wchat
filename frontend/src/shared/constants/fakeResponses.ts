const FAKE_RESPONSES = [
  "That's an interesting thought! I'd like to explore that further with you.",
  "I appreciate the question. Here are some key points to consider:",
  "Great question! Let me break this down for you.",
  "That's a common inquiry. The answer depends on several factors.",
  "Absolutely! This is something I can help you with.",
  "Interesting perspective. Have you considered looking at it from another angle?",
  "I completely understand where you're coming from.",
  "That's a thoughtful observation. Building on that idea...",
  "Perfect timing for this discussion. Here's what I'm thinking:",
  "You've raised an excellent point there.",
]

export function getRandomFakeResponse(userMessage: string): string {
  // Simple: pick random response
  // Could be enhanced to: check message content and respond contextually
  const randomIndex = Math.floor(Math.random() * FAKE_RESPONSES.length)
  const baseResponse = FAKE_RESPONSES[randomIndex]

  // Add a simple continuation to make it feel more personalized
  if (userMessage.length > 0) {
    const words = userMessage.split(' ')
    const hasQuestion = userMessage.includes('?')

    if (hasQuestion && words.length > 2) {
      return `${baseResponse} Regarding "${words.slice(0, 3).join(' ')}..." — that's definitely worth discussing in detail.`
    }
  }

  return baseResponse
}
