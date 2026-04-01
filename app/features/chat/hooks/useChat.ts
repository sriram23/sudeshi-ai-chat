import { useState } from "react";
import { Conversation, Message } from "../types/chat.types";
import { createMessage } from "../utils/messageFactory";
export function useChat() {
    const [messages, setMessages] = useState<Message[]>([])
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const addMessage = (message: Message) => {
        setMessages((prev) => [...prev, message])

        // simulate AI
        setTimeout(() => {
            const aiMessage = createMessage("assistant", "This is a simulated response from the assistant.")
            setMessages((prev) => [...prev, aiMessage])
        }, 1000)
    }
    const sendMessage = async (content: string) => {
        const userMessage = createMessage("user", content)
        addMessage(userMessage)
    }

    const createConversation = (title: string) => {
        const newConversation: Conversation = {
            id: crypto.randomUUID(),
            title,
            messages: [],
            createdAt: Date.now(),
        }
        setConversations((prev) => [...prev, newConversation])
        setActiveConversationId(newConversation.id)
    }

    const switchConversation = (conversationId: string) => {
        const conversation = conversations.find((conv) => conv.id === conversationId)
        if (conversation) {
            setActiveConversationId(conversationId)
            setMessages(conversation.messages)
        } else {
            setMessages([])
        }
    }


    return {
        messages,
        isLoading,
        error,

        addMessage,
        sendMessage,
        conversations,
        createConversation,
        switchConversation,
        activeConversationId,
    }
}
