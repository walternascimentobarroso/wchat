const REPLY_DELAY_MS = 1200

// shortcut: mock that ignores the text and picks a canned reply; swap for a real API call later.
async function send(_text: string, replies: string[]): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, REPLY_DELAY_MS))
  return replies[Math.floor(Math.random() * replies.length)]
}

export const chatService = { send }
