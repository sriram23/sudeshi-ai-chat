import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Message, MessageStatus, Metrics } from "@/app/features/chat/types/chat.types";
import { error } from "console";

type ChatStatus = "idle" | "streaming" | "error";
type ChatModel = string;

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  summary?: string;
  summaryIndex?: number;
};

type ChatStore = {
  conversations: Conversation[];
  activeConversationId: string | null;

  currentResponse: string;
  currentUsage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  currentMetrics?: Metrics
  status: ChatStatus;
  availableModels?: ChatModel[];
  settings: {
    model: ChatModel;
    showMetrics: boolean;
    baseUrl?: string;
  };

  controls: {
    abortController?: AbortController;
  };

  error: string;

  createConversation: (title?: string) => string;
  setActiveConversation: (id: string) => void;
  renameConversation: (id: string, newTitle: string) => void;
  deleteConversation: (id: string) => void;

  // Adds a new message to the active conversation
  addMessage: (message: Message) => void;
  updateMessageStatus: (id: string, status: MessageStatus) => void;

  setSummary: (conversationId: string, summary: string, summaryIndex: number) => void;

  appendToResponse: (chunk: string) => void;
  finalizeResponse: (messageStatus?: MessageStatus) => void;

  setSettings: (newSettings: Partial<{ model: ChatModel, showMetrics: boolean, baseUrl?: string }>) => void;
  setStatus: (status: ChatStatus) => void;

  setAbortController: (controller?: AbortController) => void;
  setCurrentUsage: (usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number }, metrics?: Metrics) => void;
  setModels: (models: ChatModel[]) => void;
  setError: (error: string) => void

  reset: () => void;
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,

      currentResponse: "",
      currentUsage: undefined,
      currentMetrics: undefined,
      status: "idle",

      availableModels: ["sarvam-30b", "sarvam-105b"],
      settings: {
        model: "sarvam-30b",
        showMetrics: false,
        baseUrl: "",
      },

      controls: {},

      error: "",

      // create new conversation
      createConversation: (title = "New Chat") => {
        const newId = crypto.randomUUID()
        set((state) => {
          const newConv: Conversation = {
            id: newId,
            title,
            messages: [],
            createdAt: Date.now(),
            summary: "",
            summaryIndex: 0,
          };

          return {
            conversations: [newConv, ...state.conversations],
            activeConversationId: newConv.id,
          };
        })
        return newId
      },

      // switch chat
      setActiveConversation: (id) =>
        set((state) => ({
          // checking if the id is a valid conversation id.
          activeConversationId: state.conversations.filter(con => con.id === id).length ? id : null 
        })),

      renameConversation: (id, newTitle) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id ? { ...conv, title: newTitle } : conv
          ),
        })),

      deleteConversation: (id) =>
        set((state) => {
          const updated = state.conversations.filter((conv) => conv.id !== id);
          const isDeletingActive = state.activeConversationId === id
          return {
            conversations: updated,
            activeConversationId: isDeletingActive ? updated[0]?.id ?? null : state.activeConversationId,
          }
        }),


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
        const { currentResponse, currentUsage, currentMetrics, conversations, activeConversationId } = get();

        if (!currentResponse || !activeConversationId) return;

        const newMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: currentResponse,
          createdAt: Date.now(),
          status: messageStatus,
          usage: currentUsage,
          metrics: currentMetrics
        };

        set({
          conversations: conversations.map((conv) =>
            conv.id === activeConversationId
              ? { ...conv, messages: [...conv.messages, newMessage] }
              : conv
          ),
          currentResponse: "",
          currentUsage: undefined,
          currentMetrics: undefined,
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

      setCurrentUsage: (usage, metrics) => set({ currentUsage: usage, currentMetrics: metrics }),

      setSummary: (conversationId, summary, summaryIndex) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId ? { ...conv, summary, summaryIndex } : conv
          ),
        })),

      setModels: (newModels) => set((state) => ({ availableModels: [...new Set(newModels), ...(state.availableModels ?? [])] })),

      setError: (error:string) => set({ error }),

      reset: () =>
        set({
          conversations: [],
          activeConversationId: null,
          currentResponse: "",
          currentUsage: undefined,
          currentMetrics: undefined,
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
