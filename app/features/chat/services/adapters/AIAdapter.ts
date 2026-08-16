import { Metrics } from "../../types/chat.types";

export interface AIAdapter {
    streamChat(
        message: {role: string; content: string}[],
        onChunk: (chunk: string) => void,
        onComplete?: (usage?:{ total_tokens: number, prompt_tokens: number, completion_tokens: number, prompt_cost?: number, completion_cost?: number, total_cost?: number }, metrics?:Metrics) => void,
        signal?: AbortSignal
    ): Promise<void>
}