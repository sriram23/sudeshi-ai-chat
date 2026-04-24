import { Metrics } from "../types/chat.types";
import { ollamaParser, processStream, sseParser } from "../utils/processStream";

const computeMetrics = (
  newMetrics: Metrics,
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number } | undefined
): {totalTime:number, timeToFirstChunk?:number, streamingTime?:number, tokensPerSecond?:number} => {
  const totalTime = newMetrics.endTime! - newMetrics.startTime;

  const timeToFirstChunk = newMetrics.firstChunkTime
    ? newMetrics.firstChunkTime - newMetrics.startTime
    : undefined;

  const streamingTime =
    newMetrics.firstChunkTime && newMetrics.endTime
      ? newMetrics.endTime - newMetrics.firstChunkTime
      : undefined;

  const tokens = usage?.completion_tokens;

  const tokensPerSecond =
    streamingTime && tokens
      ? tokens / (streamingTime / 1000)
      : undefined;
  return {
    totalTime,
    timeToFirstChunk,
    streamingTime,
    tokensPerSecond,
  };
};

export async function streamChat(
    isLocal: boolean = false,
    messages: { role: string; content: string }[],
    model: string = "sarvam-30b",
    onChunk: (chunk: string) => void,
    onComplete?: (usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number }, metrics?:Metrics) => void,
    endpoint?: string,
    signal?: AbortSignal
) {
    const metrics: Metrics = {
        startTime: performance.now()
    }
    const res = isLocal
        ? await fetch("/api/ollama", {
            method: "POST",
            body: JSON.stringify({messages, model, endpoint}),
            signal
        })
        : await fetch("/api/chat", {
            method: "POST",
            body: JSON.stringify({ messages, model }),
            signal
        });

    if (!res.ok || !res.body) {
        throw new Error("Network response was not ok");
    }
    console.log("Response received, starting to read stream...");
    if(isLocal) {
        await processStream(res.body, ollamaParser, (chunk) => {
            onChunk(chunk)
        })
    } else {
        await processStream(res.body, sseParser, (chunk) => {
            const now = performance.now()
            if(!metrics.firstChunkTime) {
                metrics.firstChunkTime = now
            }
            onChunk(chunk)
        }, (usage) => {
            metrics.endTime = performance.now()
            const {totalTime, timeToFirstChunk, streamingTime, tokensPerSecond,} = computeMetrics(metrics, usage)
            metrics.totalTime = totalTime
            metrics.timeToFirstChunk = timeToFirstChunk
            metrics.streamingTime = streamingTime
            metrics.tokensPerSecond = tokensPerSecond
            return onComplete?.(usage, metrics)
        })
    }
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

export async function fetchAvailableModels(endpoint: string) {
    if(endpoint) {
        try {
            const response = await fetch("/api/checkOllama", {
                method: "POST",
                body: JSON.stringify({endpoint: endpoint})
            });
            if (!response.ok) {
                throw new Error("Failed to fetch available models");
            }
            const data = await response.json();
            return data.models;
        } catch (error) {
            console.error("Error fetching available models:", error);
            return [];
        }
    }
}

// export async function streamLocalModels(prompt : string, model: string, onChunk: (chunk: string) => void, onComplete?: unknown, signal?: AbortSignal) {
//     const res = await fetch("/api/ollama", {
//         method: "POST",
//         body: JSON.stringify({
//             prompt,
//             model,
//             signal
//         })
//     })
//     if (!res.ok || !res.body) {
//         throw new Error("Network response was not ok");
//     }
//     console.log("Response received, starting to read stream...");
//     await processStream(res.body, (chunk)=>onChunk(chunk))
// }