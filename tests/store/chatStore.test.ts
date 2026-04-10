import { Message } from "@/app/features/chat/types/chat.types";
import { useChatStore } from "@/store/chatStore";
import { beforeEach, describe, it, expect} from "vitest";

beforeEach(() => {
    useChatStore.setState({
        conversations: [],
        activeConversationId: null
    })
})

describe("Chat Store", () => {
    // Happy path tests
    it("should create a new conversation", () => {
        const { createConversation } = useChatStore.getState()

        const id = createConversation("test1");

        const state = useChatStore.getState()

        expect(state.conversations.length).toBe(1);
        expect(state.conversations[0].id).toBe(id);

    })
    it("should set newly created conversation active", () => {
        const { createConversation } = useChatStore.getState()
        const id = createConversation("test")

        const state = useChatStore.getState()
        expect(state.activeConversationId).toBe(id)
    })
    it("should make a conversation active", () => {
        const { createConversation, setActiveConversation } = useChatStore.getState()

        const convId1 = createConversation("test-active-1")
        createConversation("test-active-2")
        setActiveConversation(convId1)
        const state = useChatStore.getState()
        expect(state.activeConversationId).toBe(convId1)
    })
    it("should create multiple conversations correctly", () => {
        const { createConversation } = useChatStore.getState()

        createConversation("test-1")
        createConversation("test-2")
        createConversation("test-3")
        createConversation("test-4")
        createConversation("test-5")

        const state = useChatStore.getState()
        expect(state.conversations.length).toBe(5)
    })
    it("should set the first conversation active when the active conversation is deleted", () => {
        const { createConversation, deleteConversation, setActiveConversation } = useChatStore.getState()

        createConversation("test-1")
        const delConvId = createConversation("test-2")
        setActiveConversation(delConvId)
        deleteConversation(delConvId)

        const state = useChatStore.getState()
        // If an active convo is deleted, the first convo should be made active.
        expect(state.activeConversationId).toBe(state.conversations[0].id)
        // If an conversation is deleted, it should not be there in the state.
        expect(state.conversations.find(c => c.id === delConvId)).toBeUndefined()
    })
    it("should set the activeConversationId null when the active conversation is the only conversation", () => {
        const { createConversation, deleteConversation } = useChatStore.getState()
        const convoId = createConversation("test-1")

        const state1 = useChatStore.getState()
        expect(state1.activeConversationId).toBe(convoId)
        expect(state1.conversations.length).toBe(1)

        deleteConversation(convoId)
        const state2 = useChatStore.getState()
        expect(state2.activeConversationId).toBe(null)
        expect(state2.conversations.length).toBe(0)
    })
    it("should delete a non-active conversation", () => {
        const { createConversation, deleteConversation, setActiveConversation } = useChatStore.getState()
        const delConvo = createConversation("test-1")
        const nonDelConvo = createConversation("test-2")
        createConversation("test-3")
        setActiveConversation(nonDelConvo)
        deleteConversation(delConvo)

        const state = useChatStore.getState()
        // The deleted convo should not be in the state
        expect(state.conversations.find(con => con.id === delConvo)).toBeUndefined()
        expect(state.activeConversationId).toBe(nonDelConvo)
    })
    it("should add message to correct conversation", () => {
        const {createConversation, addMessage } = useChatStore.getState()
        const convId = createConversation("test")
        const newMessage:Message = {id: "abcd-efgh", role: "user", content: "test message", createdAt: Date.now(), status:"completed"}
        addMessage(newMessage)

        const state = useChatStore.getState()
        const convo = state.conversations.find(c => c.id === convId)
        expect(convo?.messages).toContainEqual(newMessage)
        expect(convo?.messages.length).toBe(1)
    })
    it("should ensure activeConversationId exists in conversation when not null", () => {
        const { createConversation } = useChatStore.getState()
        createConversation("test")

        const state = useChatStore.getState()
        // The active conversation to be actually present in the list.
        const conv = state.conversations.some(c => c.id === state.activeConversationId)
        expect(conv).toBe(true)
    })

    // Negative tests
    it("should not break when deleting a non-existing conversation", () => {
        const { deleteConversation } = useChatStore.getState()
        deleteConversation("invalid-id")

        const state = useChatStore.getState()
        expect(state.conversations.length).toBe(0)
        expect(state.activeConversationId).toBe(null)
    })
    it("should not set activeConversationId for invalid id", () => {
        const { setActiveConversation } = useChatStore.getState()
        setActiveConversation("invalid-id")

        const state = useChatStore.getState()
        expect(state.activeConversationId).toBe(null)
    })
    it("should not add message when no active conversation exists", () => {
        const { addMessage } = useChatStore.getState()
        const newMessage:Message = {
            id: "a-new-id",
            role: "user",
            content: "test",
            createdAt: Date.now(),
            status: "completed"
        }

        addMessage(newMessage)

        const state = useChatStore.getState()
        expect(state.conversations.length).toBe(0)
        expect(state.activeConversationId).toBe(null)
    })
    it("should not add message if activeConversationId points to deleted conversation", () => {
        const { createConversation, deleteConversation, addMessage } = useChatStore.getState()
        const id = createConversation("test")
        deleteConversation(id)
        const newMessage:Message = {
            id: "12342",
            role: "user",
            content: "test message",
            createdAt: Date.now(),
            status: "completed"
        }
        addMessage(newMessage)

        const state = useChatStore.getState()

        expect(state.conversations.length).toBe(0)

    })
})
