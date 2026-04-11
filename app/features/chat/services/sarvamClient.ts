import { processStream } from "../utils/processStream";

export async function streamChat(
    messages: { role: string; content: string }[],
    model: string = "sarvam-30b",
    onChunk: (chunk: string) => void,
    onComplete?: (usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number }) => void,
    signal?: AbortSignal
) {
    const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages, model }),
        signal
    });

    if (!res.ok || !res.body) {
        throw new Error("Network response was not ok");
    }
    console.log("Response received, starting to read stream...");

    await processStream(res.body, onChunk, onComplete)
}

export async function summarizeText(
    messages: { role: string; content: string }[],
    availableSummary?: string
) {
    messages = messages.slice(-20);
    const text = messages.map(m => `${m.role}: ${m.content}`).join("\n");
    const summaryPrompt = `You are a precise summarization engine.

Your job is to compress a conversation into a structured summary that preserves context for future AI responses.

Rules:
- Capture key user intents and goals
- Capture important facts and constraints
- Capture decisions or conclusions made
- Capture ongoing tasks or open questions
- Remove repetition and irrelevant details
- Do NOT add new information
- Keep it concise but information-dense

Output format:
- Bullet points
- Clear and structured
- No fluff

Summarize the following conversation:${availableSummary ? `\n\nExisting summary:\n${availableSummary}\n\nConversation:\n${text}` : `\n\n${text}`}
`.trim();

    if (messages.length < 6) {
        // Returning the original text if the conversation is short.
        return text;
    }
    try {
        const res = await fetch("/api/summarize", {
            method: "POST",
            body: JSON.stringify({ text: summaryPrompt }),
        });
        const data = await res.json();
        return data.summary;
    } catch (error) {
        console.error("Error summarizing text:", error);
        return text;
    }
}

export async function generateTitle(
    messages: { role: string; content: string }[]
) {
    const text = messages.map(m => `${m.role}: ${m.content}`).join("\n");
    const titlePrompt = `You are a helpful assistant that generates concise and descriptive titles for conversations.
Rules:
- Capture the main topic or theme of the conversation
- Reflect the user's intent or goal
- Be concise (ideally under 5 words)
- Be descriptive enough to differentiate from other conversations
Generate a title for the following conversation:\n\n${text}`.trim();

    try {
        const res = await fetch("/api/title", {
            method: "POST",
            body: JSON.stringify({ message: titlePrompt }),
        });
        const data = await res.json();
        return data.title;
    } catch (error) {
        console.error("Error generating title:", error);
        return "Untitled Conversation";
    }
}