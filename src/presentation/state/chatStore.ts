import { create } from 'zustand'
import { Chat } from '@/domains/chat/entities/Chat'
import { Message } from '@/domains/chat/entities/Message'
import { ChatService } from '@/domains/chat/services/ChatService'
import { LocalStorageChatRepository } from '@/infrastructure/storage/LocalStorageChatRepository'
import type { ChatEntity, MessageEntity } from '@/domains/chat/types'

const repository = new LocalStorageChatRepository()
const chatService = new ChatService(repository)

export interface ChatStore {
  // State
  chats: Chat[]
  messages: Record<string, Message[]>
  selectedChatId: string | null
  isTyping: boolean

  // Actions
  loadChats: () => Promise<void>
  createChat: () => Promise<void>
  deleteChat: (id: string) => Promise<void>
  selectChat: (id: string | null) => void
  sendMessage: (content: string) => Promise<void>
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  messages: {},
  selectedChatId: null,
  isTyping: false,

  loadChats: async () => {
    try {
      const chats = await chatService.loadChats()
      set({ chats })

      // Initialize messages map
      const messages: Record<string, Message[]> = {}
      for (const chat of chats) {
        messages[chat.id] = []
      }
      set({ messages })
    } catch (error) {
      console.error('Failed to load chats:', error)
    }
  },

  createChat: async () => {
    try {
      const newChat = chatService.createChat()
      const { chats } = get()
      const updatedChats = [...chats, newChat]

      await chatService.persistChats(updatedChats)
      set((state) => ({
        chats: updatedChats,
        messages: { ...state.messages, [newChat.id]: [] },
        selectedChatId: newChat.id,
      }))
    } catch (error) {
      console.error('Failed to create chat:', error)
    }
  },

  deleteChat: async (id: string) => {
    try {
      const { chats } = get()
      const updatedChats = chatService.deleteChat(chats, id)

      await chatService.persistChats(updatedChats)

      set((state) => {
        const newMessages = { ...state.messages }
        delete newMessages[id]

        return {
          chats: updatedChats,
          messages: newMessages,
          selectedChatId: state.selectedChatId === id ? null : state.selectedChatId,
        }
      })
    } catch (error) {
      console.error('Failed to delete chat:', error)
    }
  },

  selectChat: (id: string | null) => {
    set({ selectedChatId: id })
  },

  sendMessage: async (content: string) => {
    const { selectedChatId, chats } = get()

    if (!selectedChatId) {
      console.warn('No chat selected')
      return
    }

    // Create user message
    const userMessage = chatService.sendMessage(selectedChatId, content)

    // Add user message to messages
    set((state) => ({
      messages: {
        ...state.messages,
        [selectedChatId]: [...(state.messages[selectedChatId] || []), userMessage],
      },
      isTyping: true,
    }))

    // Generate fake assistant response
    try {
      const assistantMessage = await chatService.generateFakeResponse(selectedChatId, content)

      set((state) => ({
        messages: {
          ...state.messages,
          [selectedChatId]: [...state.messages[selectedChatId], assistantMessage],
        },
        isTyping: false,
      }))

      // Persist messages to storage
      const { messages } = get()
      const messagesToPersist = Object.entries(messages).reduce(
        (acc, [, msgs]) => [...acc, ...msgs.map((m) => m.toDTO() as MessageEntity)],
        [] as MessageEntity[]
      )
      // Note: For now, we're only persisting chats, not individual messages
      // This could be extended in the future
    } catch (error) {
      console.error('Failed to generate response:', error)
      set({ isTyping: false })
    }
  },
}))
