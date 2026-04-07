import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Message, MessageStatus } from "@/app/features/chat/types/chat.types";

type ChatStatus = "idle" | "streaming" | "error";
type ChatModel = "sarvam-30b" | "sarvam-105b";

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
};

type ChatStore = {
  conversations: Conversation[];
  activeConversationId: string | null;

  currentResponse: string;
  currentUsage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  status: ChatStatus;

  settings: {
    model: ChatModel;
  };

  controls: {
    abortController?: AbortController;
  };

  createConversation: (title?: string) => void;
  setActiveConversation: (id: string) => void;

  addMessage: (message: Message) => void;
  updateMessageStatus: (id: string, status: MessageStatus) => void;

  appendToResponse: (chunk: string) => void;
  finalizeResponse: (messageStatus?: MessageStatus) => void;

  setSettings: (newSettings: Partial<{ model: ChatModel }>) => void;
  setStatus: (status: ChatStatus) => void;

  setAbortController: (controller?: AbortController) => void;
  setCurrentUsage: (usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number }) => void;

  reset: () => void;
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,

      currentResponse: "",
      currentUsage: undefined,
      status: "idle",

      settings: {
        model: "sarvam-30b",
      },

      controls: {},

      // create new conversation
      createConversation: (title = "New Chat") =>
        set((state) => {
          const newConv: Conversation = {
            id: crypto.randomUUID(),
            title,
            messages: [],
            createdAt: Date.now(),
          };

          return {
            conversations: [newConv, ...state.conversations],
            activeConversationId: newConv.id,
          };
        }),

      // switch chat
      setActiveConversation: (id) =>
        set({ activeConversationId: id }),

      // add user message
      addMessage: (message) =>
        set((state) => {
          if (!state.activeConversationId) return state;

          return {
            conversations: state.conversations.map((conv) =>
              conv.id === state.activeConversationId
                ? { ...conv, messages: [...conv.messages, message] }
                : conv
            ),
          };
        }),

      updateMessageStatus: (id, status) =>
        set((state) => {
          if (!state.activeConversationId) return state;

          return {
            conversations: state.conversations.map((conv) =>
              conv.id === state.activeConversationId
                ? {
                    ...conv,
                    messages: conv.messages.map((msg) =>
                      msg.id === id ? { ...msg, status } : msg
                    ),
                  }
                : conv
            ),
          };
        }),

      // streaming buffer
      appendToResponse: (chunk) =>
        set((state) => ({
          currentResponse: state.currentResponse + chunk,
        })),

      // finalize AI response
      finalizeResponse: (messageStatus: MessageStatus="completed") => {
        const { currentResponse, currentUsage, conversations, activeConversationId } = get();

        if (!currentResponse || !activeConversationId) return;

        const newMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: currentResponse,
          createdAt: Date.now(),
          status: messageStatus,
          usage: currentUsage,
        };

        set({
          conversations: conversations.map((conv) =>
            conv.id === activeConversationId
              ? { ...conv, messages: [...conv.messages, newMessage] }
              : conv
          ),
          currentResponse: "",
          currentUsage: undefined,
          status: "idle",
          controls: {
            ...get().controls,
            abortController: undefined,
          },
        });
      },

      setSettings: (newSettings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings,
          },
        })),

      setStatus: (status) => set({ status }),

      setAbortController: (controller) =>
        set((state) => ({
          controls: {
            ...state.controls,
            abortController: controller,
          },
        })),

      setCurrentUsage: (usage) => set({ currentUsage: usage }),

      reset: () =>
        set({
          conversations: [],
          activeConversationId: null,
          currentResponse: "",
          currentUsage: undefined,
          status: "idle",
          controls: {},
        }),
    }),
    {
      name: "sudeshi-chat-store",
      partialize: (state) => ({
        conversations: state.conversations,
        settings: state.settings,
        activeConversationId: state.activeConversationId,
      }),
    }
  )
);
