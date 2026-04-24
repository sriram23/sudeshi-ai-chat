import { useChatStore } from "@/store/chatStore";
import { createMessage } from "@/app/features/chat/utils/messageFactory";
import { generateTitle, streamChat, summarizeText } from "../services/sarvamClient";

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
    setSummary,
    renameConversation,
  } = useChatStore();

    const generateAndSetConversationTitle = async (conversationId: string) => {
    const { conversations } = useChatStore.getState();
    const conversation = conversations.find((c) => c.id === conversationId);
    if (!conversation) return;

    const messages = conversation.messages;
    if (messages.length === 0) return;

    try {
      const title = await generateTitle(messages);
      renameConversation(conversationId, title);
    } catch (error) {
      console.error("Error generating conversation title:", error);
    }
  };


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

    if(activeConversation?.title.includes("New Chat") && activeConversation.messages.length === 1) {
      // Generate title for new conversation based on first user message
      generateAndSetConversationTitle(activeConversation.id);
    }
    const latestMessages = activeConversation?.messages || [];
    const availableSummary = activeConversation?.summary;
    // build context
    const history = latestMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
    const oldMessages = history.slice(0, -19);
    let summarizedContent = "";
    const shouldSummarize = activeConversation?.summaryIndex !== undefined && history.length - activeConversation.summaryIndex > 19;
    if(shouldSummarize) {
      summarizedContent = await summarizeText(oldMessages, availableSummary);
      setSummary(activeConversationId!, summarizedContent, history.length);
    }
    const truncatedHistory = history.slice(-19);
    const payload = shouldSummarize ? [{ role: "system", content: summarizedContent }, ...truncatedHistory] : truncatedHistory;

    // create controller AFTER guards
    const controller = new AbortController();
    setAbortController(controller);

    setStatus("streaming");
    try {
      await streamChat(
        !(settings.model === "sarvam-30b" || settings.model === "sarvam-105b"),
        payload,
        settings.model,
        (chunk) => appendToResponse(chunk),
        (usage, metrics) => setCurrentUsage(usage, metrics),
        settings.baseUrl,
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

  return { sendMessage, stopStreaming, generateAndSetConversationTitle };
}
