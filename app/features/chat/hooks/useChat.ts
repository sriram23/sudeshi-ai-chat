import { useChatStore } from "@/store/chatStore";
import { createMessage } from "@/app/features/chat/utils/messageFactory";
import { generateTitle, streamChat, summarizeText } from "../services/sarvamClient";
import { SUMMARIZE_TOKEN_THRESHOLD, PRESERVED_MESSAGE_COUNT } from "../utils/constants";



export const buildContextHistory = (messages: Array<{ role: string; content: string; usage?: { total_tokens?: number } }>) =>
  messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
    usage: msg.usage,
  }));

export const getConversationTokenCount = (history: Array<{ role: string; content: string; usage?: { total_tokens?: number } }>) => {
  const assistantMessages = history.filter((message) => message.role === "assistant");

  return assistantMessages.reduce((total, message) => {
    const usage = message.usage;
    return total + (usage?.total_tokens ?? 0);
  }, 0);
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
    setIsSummarizingContext,
    renameConversation,
  } = useChatStore();

    const generateAndSetConversationTitle = async (conversationId: string) => {
    const { conversations } = useChatStore.getState();
    const conversation = conversations.find((c) => c.id === conversationId);
    if (!conversation) return;

    const messages = conversation.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

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
    const history = buildContextHistory(latestMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
      usage: msg.usage,
    })));
    const currentTokenCount = getConversationTokenCount(history);

    const preservedHistory = history.slice(-PRESERVED_MESSAGE_COUNT);
    const summarizedTargets = history.length > preservedHistory.length ? history.slice(0, -PRESERVED_MESSAGE_COUNT) : [];

    const contextThresholdExceeded = currentTokenCount > SUMMARIZE_TOKEN_THRESHOLD;

    if (activeConversationId) {
      setContextThresholdExceeded(activeConversationId, contextThresholdExceeded);
    }

    let summarizedContent = "";
    const shouldSummarize =
      contextThresholdExceeded &&
      summarizedTargets.length > 0

    if (shouldSummarize) {
      setIsSummarizingContext(true);
      try {
        summarizedContent = await summarizeText(summarizedTargets, availableSummary);
        if (activeConversationId) {
          setSummary(activeConversationId, summarizedContent, PRESERVED_MESSAGE_COUNT);
        }
      } finally {
        setIsSummarizingContext(false);
      }
    }

    const payload = shouldSummarize
      ? [
        { role: "system", content: summarizedContent },
        ...preservedHistory,
      ]
      : history;

    // create controller AFTER guards
    const controller = new AbortController();
    setAbortController(controller);

    setStatus("streaming");
    console.log("Payload: ", payload)
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
