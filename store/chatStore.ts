import { create } from "zustand";
import { Message, MessageStatus } from "@/app/features/chat/types/chat.types";

export const useChatStore = create((set, get) => ({
    messages: [] as Message[],
    currentResponse: "" as string,
    status: "idle" as "idle" | "streaming" | "error",
    controls: {
        abortController: AbortController
    },
    addMessage: (message: Message) => set((state) => ({ messages: [...state.messages, message] })),
    updateMessageStatus: (id: string, status: MessageStatus) => set((state) => ({
        messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, status } : msg
        ),
    })),

    updateGlobalStatus: (status: "idle" | "streaming" | "error") => set({ status }),
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
    })
  },

  setAbortController: (controller?: AbortController) => {},
  reset: () =>
    set({
      messages: [],
      currentResponse: "",
      status: "idle",
    }),
}))