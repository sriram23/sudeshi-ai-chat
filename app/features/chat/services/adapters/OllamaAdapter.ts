import { Metrics } from "../../types/chat.types";
import { ollamaParser, processStream } from "../../utils/processStream";
import { AIAdapter } from "./AIAdapter";

export class OllamaAdapter implements AIAdapter{
    constructor(private endpoint: string, private model: string) {}

    async streamChat(messages: { role: string; content: string; }[], onChunk: (chunk: string) => void, onComplete?: (usage?: { total_tokens: number, prompt_tokens: number, completion_tokens: number, prompt_cost?: number, completion_cost?: number, total_cost?: number }, metrics?: Metrics) => void, signal?: AbortSignal, thinking?: string, onThinkingChunk?: (chunk: string) => void): Promise<void> {
        const res = await fetch("/api/ollama", {
            method: "POST",
            body: JSON.stringify({
                messages,
                model: this.model,
                endpoint: this.endpoint
            }),
            signal
        })
        if(!res.ok || !res.body) {
            throw new Error("Network error")
        }

        await processStream(res.body, ollamaParser, onChunk, onComplete, this.model, onThinkingChunk)
    }
}