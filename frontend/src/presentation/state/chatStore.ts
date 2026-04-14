import { create } from 'zustand'
import { Chat } from '@/domains/chat/entities/Chat'
import { Message } from '@/domains/chat/entities/Message'
import { MessageRole } from '@/domains/chat/types'
import { ChatService } from '@/domains/chat/services/ChatService'
import { LocalStorageChatRepository } from '@/infrastructure/storage/LocalStorageChatRepository'
import { streamChatMessage } from '@/infrastructure/api/chatApi'
import { generateId } from '@/shared/utils/id'

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
      const messages: Record<string, Message[]> = {}
      for (const chat of chats) {
        messages[chat.id] = []
      }
      set({ chats, messages })
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
    const { selectedChatId } = get()
    if (!selectedChatId) return

    const userMessage = chatService.sendMessage(selectedChatId, content)

    set((state) => ({
      messages: {
        ...state.messages,
        [selectedChatId]: [...(state.messages[selectedChatId] ?? []), userMessage],
      },
      isTyping: true,
    }))

    const assistantMessage = new Message(
      generateId(),
      selectedChatId,
      MessageRole.ASSISTANT,
      '',
      new Date()
    )

    set((state) => ({
      messages: {
        ...state.messages,
        [selectedChatId]: [...state.messages[selectedChatId], assistantMessage],
      },
    }))

    try {
      await streamChatMessage(selectedChatId, content, (token) => {
        set((state) => {
          const chatMessages = state.messages[selectedChatId]
          const updated = chatMessages.map((m) =>
            m.id === assistantMessage.id
              ? new Message(m.id, m.chatId, m.role, m.content + token, m.createdAt)
              : m
          )
          return { messages: { ...state.messages, [selectedChatId]: updated } }
        })
      })
    } catch (error) {
      console.error('Failed to stream response:', error)
    } finally {
      set({ isTyping: false })
    }
  },
}))
