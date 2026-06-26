import { useChatStore } from "@/store/chatStore";
import { createMessage } from "@/app/features/chat/utils/messageFactory";
import { generateTitle, streamChat, summarizeText } from "../services/sarvamClient";

const SUMMARIZE_TOKEN_THRESHOLD = 1200;

const estimateTokenCount = (text: string) => {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return Math.max(1, Math.ceil(new TextEncoder().encode(trimmed).length / 4));
};

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
    setContextThresholdExceeded,
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
    const currentContextText = history
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");
    const currentTokenCount = estimateTokenCount(currentContextText);

    const preservedHistory = history.slice(-9);
    const summarizedTargets = history.length > preservedHistory.length ? history.slice(0, -9) : history;

    const contextThresholdExceeded =
      currentTokenCount > SUMMARIZE_TOKEN_THRESHOLD;

    setContextThresholdExceeded(activeConversationId!, contextThresholdExceeded);

    let summarizedContent = "";
    const shouldSummarize =
      activeConversation?.summaryIndex !== undefined &&
      contextThresholdExceeded &&
      summarizedTargets.length > 0;

    if (shouldSummarize) {
      summarizedContent = await summarizeText(summarizedTargets, availableSummary);
      setSummary(activeConversationId!, summarizedContent, history.length);
    }

    const payload = shouldSummarize
      ? summarizedTargets.length === history.length
        ? [{ role: "system", content: summarizedContent }]
        : [{ role: "system", content: summarizedContent }, ...preservedHistory]
      : history;

    // create controller AFTER guards
    const controller = new AbortController();
    setAbortController(controller);

    setStatus("streaming");
    try {
      await streamChat(
        {
          provider: (settings.model === "sarvam-30b" || settings.model === "sarvam-105b") ? "sarvam" : "ollama",
          model: settings.model,
          endpoint: settings.baseUrl
        },
        payload,
        (chunk) => appendToResponse(chunk),
        (usage, metrics) => setCurrentUsage(usage, metrics),
        controller.signal
      )

      finalizeResponse();
      setStatus("idle");
    } catch (error) {
      if (controller.signal.aborted) {
        finalizeResponse("cancelled");
        setStatus("idle");
      } else {
        console.error("Error during streaming:", error);
        finalizeResponse("error")
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
