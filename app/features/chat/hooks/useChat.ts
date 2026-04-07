import { useChatStore } from "@/store/chatStore";
import { createMessage } from "@/app/features/chat/utils/messageFactory";
import { streamChat } from "../services/sarvamClient";

export const useChat = () => {
  const {
    addMessage,
    appendToResponse,
    finalizeResponse,
    setStatus,
    status,
    setAbortController,
    createConversation,
    settings,
    setCurrentUsage,
  } = useChatStore();

  const sendMessage = async (input: string) => {
    if (!input.trim()) return;
    if (status === "streaming") return;

    const store = useChatStore.getState();

    // ensure conversation exists
    if (!store.activeConversationId) {
      createConversation("New Chat");
    }

    // add user message
    const userMessage = createMessage("user", input, "completed");
    addMessage(userMessage);

    // get latest state AFTER adding message
    const {
      conversations,
      activeConversationId,
    } = useChatStore.getState();

    const activeConversation = conversations.find(
      (c) => c.id === activeConversationId
    );

    const latestMessages = activeConversation?.messages || [];

    // build context
    const history = latestMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const truncatedHistory = history.slice(-20);

    // create controller AFTER guards
    const controller = new AbortController();
    setAbortController(controller);

    setStatus("streaming");

    try {
      await streamChat(
        truncatedHistory,
        settings.model,
        (chunk) => appendToResponse(chunk),
        (usage) => setCurrentUsage(usage),
        controller.signal
      );

      finalizeResponse();
      setStatus("idle");
    } catch (error) {
      if (controller.signal.aborted) {
        finalizeResponse("error");
        setStatus("idle");
      } else {
        console.error("Error during streaming:", error);
        setStatus("error");
      }
    } finally {
      setAbortController(undefined);
    }
  };

  const stopStreaming = () => {
    const { controls } = useChatStore.getState();
    controls.abortController?.abort();
  };

  return { sendMessage, stopStreaming };
}
