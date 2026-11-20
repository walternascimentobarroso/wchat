export interface User {
  name: string
  email: string
}

export const DEMO_ACCOUNT = { email: 'demo@wchat.com', password: 'demo123' } as const

const DEMO_USER: User = { name: 'Demo User', email: DEMO_ACCOUNT.email }
const USER_KEY = 'current_user'

// shortcut: single mock user in localStorage, not real auth; replace with an API + httpOnly cookie when a backend exists
export const authService = {
  login(email: string, password: string): User {
    if (email !== DEMO_ACCOUNT.email || password !== DEMO_ACCOUNT.password) {
      throw new Error('invalidCredentials')
    }
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(DEMO_USER))
    } catch (error) {
      console.error('Failed to store session:', error)
    }
    return DEMO_USER
  },

  logout() {
    try {
      localStorage.removeItem(USER_KEY)
    } catch (error) {
      console.error('Failed to clear session:', error)
    }
  },

  getStoredUser(): User | null {
    try {
      const stored = localStorage.getItem(USER_KEY)
      return stored ? (JSON.parse(stored) as User) : null
    } catch {
      return null
    }
  },
}
