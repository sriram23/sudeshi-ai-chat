import { Metrics } from "../../types/chat.types";
import { processStream, sseParser } from "../../utils/processStream";
import { computeMetrics } from "../sarvamClient";
import { AIAdapter } from "./AIAdapter";

export class SarvamAdapter implements AIAdapter {
    constructor(private model: string) {}

    async streamChat(messages: { role: string; content: string; }[], onChunk: (chunk: string) => void, onComplete?: (usage?: { total_tokens: number, prompt_tokens: number, completion_tokens: number }, metrics?: Metrics) => void, signal?: AbortSignal): Promise<void> {
        console.log("Calling Sarvam")
        const metrics:Metrics = { startTime: performance.now() }

        const res = await fetch("/api/chat", {
            method: "POST",
            body: JSON.stringify({messages, model: this.model}),
            signal
        })

        if(!res.ok || !res.body) {
            throw new Error("Network error")
        }
        console.log("Res: ", res.body)

        await processStream(
            res.body,
            sseParser,
            (chunk) => {
                if(!metrics.firstChunkTime) {
                    metrics["firstChunkTime"] = performance.now()
                }
                onChunk(chunk)
            },
            (usage) => {
                metrics.endTime = performance.now()
                const {totalTime, timeToFirstChunk, streamingTime, tokensPerSecond,} = computeMetrics(metrics, usage)
                metrics.totalTime = totalTime
                metrics.timeToFirstChunk = timeToFirstChunk
                metrics.streamingTime = streamingTime
                metrics.tokensPerSecond = tokensPerSecond
                return onComplete?.(usage, metrics)
            }
        )
    }
}