import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Message, MessageStatus } from "@/app/features/chat/types/chat.types";

type ChatStatus = "idle" | "streaming" | "error";

type ChatModel = "sarvam-30b" | "sarvam-105b";

type ChatControls = {
  abortController?: AbortController;
};

type ChatStore = {
  messages: Message[];
  currentResponse: string;
  status: ChatStatus;
  settings: {
    model: ChatModel;
  };
  controls: ChatControls;
  addMessage: (message: Message) => void;
  setSettings: (newSettings: { model: ChatModel }) => void;
  updateMessageStatus: (id: string, status: MessageStatus) => void;
  updateGlobalStatus: (status: ChatStatus) => void;
  appendToResponse: (chunk: string) => void;
  finalizeResponse: () => void;
  setAbortController: (controller?: AbortController) => void;
  reset: () => void;
};

export const useChatStore = create<ChatStore>()(persist(
  (set, get) => ({
  messages: [],
  currentResponse: "",
  status: "idle",
  settings: {
    model: "sarvam-30b"
  },
  controls: {
    abortController: undefined,
  },
    addMessage: (message: Message) => set((state) => ({ messages: [...state.messages, message] })),
    updateMessageStatus: (id: string, status: MessageStatus) => set((state) => ({
        messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, status } : msg
        ),
    })),

    updateGlobalStatus: (status: "idle" | "streaming" | "error") => set({ status }),
    setSettings : (newSettings: { model: "sarvam-30b" | "sarvam-105b" }) => set( (state) => ({ settings: {
        ...state.settings,
        ...newSettings
    } })),
    appendToResponse: (chunk: string) => set((state) => ({
        currentResponse: state.currentResponse + chunk
    })),
    finalizeResponse: () => {
    const { currentResponse, messages } = get()

    if (!currentResponse) return

    const newMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: currentResponse,
      createdAt: Date.now(),
      status: "completed",
    }

    set({
      messages: [...messages, newMessage],
      currentResponse: "",
      status: "idle",
      controls: {
        ...get().controls,
        abortController: undefined,
      },
    })
  },

  setAbortController: (controller?: AbortController) =>
    set((state) => ({
      controls: {
        ...state.controls,
        abortController: controller,
      },
    })),

  reset: () =>
    set({
      messages: [],
      currentResponse: "",
      status: "idle",
      controls: {
        abortController: undefined,
      },
    }),
}),{
  name: "sudeshi-chat-store",
  partialize: (state) => ({
    messages: state.messages,
    settings: state.settings,
  }),
}))
