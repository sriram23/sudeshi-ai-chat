import { Metrics } from "../types/chat.types";
import { PROMPT_COST_105B, COMPLETION_COST_105B, MILLION } from "./constants";

const isSarvam105BModel = (model?: string) =>
  typeof model === "string" && /sarvam[-_ ]?105b|105b/i.test(model);

const applyUsageCosts = (usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number; prompt_cost?: number; completion_cost?: number; total_cost?: number }, model?: string) => {
  if (!isSarvam105BModel(model)) {
    usage.prompt_cost = -1;
    usage.completion_cost = -1;
    usage.total_cost = -1;
    return usage;
  }

  usage.prompt_cost = (usage.prompt_tokens / MILLION) * PROMPT_COST_105B;
  usage.completion_cost = (usage.completion_tokens / MILLION) * COMPLETION_COST_105B;
  usage.total_cost = usage.prompt_cost + usage.completion_cost;

  return usage;
};

type Usage = {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
};

type ParserResult = {
  text?: string;
  done?: boolean;
  usage?: Usage;
  metrics?: Metrics
};

type StreamParser = (line: string) => ParserResult | null;

export async function processStream(
    stream: ReadableStream,
    parser: StreamParser,
    onChunk: (chunk: string) => void,
    onComplete?: (usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number, prompt_cost?: number, completion_cost?: number, total_cost?: number }, metrics?: Metrics) => void,
    model?: string
) {
    const reader = stream.getReader()
    const decoder = new TextDecoder("utf-8");

    let buffer = "";
    let usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number, prompt_cost?: number, completion_cost?: number, total_cost?: number } | undefined;

    while(true) {
        const { done, value } = await reader.read();
        if (done) {
            console.log("Stream complete");
            break;
        }
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");

        buffer = lines.pop() || "";

        for (const line of lines) {
            const result = parser(line.trim())
            if(!result) continue

            if(result.text) {
                onChunk(result.text)
            }

            if(result.usage) {
                usage = result.usage
                applyUsageCosts(usage, model)
            }
            if(result.done) {
                onComplete?.(usage, result?.metrics)
                return
            }
        }
    }
}

export const sseParser:StreamParser = (line) => {
    if(!line.startsWith("data:")) return null

    const data = line.replace(/^data:\s*/, "");
    if (data === "[DONE]") {
        return {done: true};
    }
    try {
        const json = JSON.parse(data);

        const text = json?.choices[0]?.delta?.content || json?.choices[0]?.message?.content || "";
        const usage = json?.usage
        return {
            text,
            usage
        }

    } catch (error) {
        console.error("Error parsing JSON:", error);
        return null
    }
}

export const ollamaParser: StreamParser = (line) => {
    if(!line) return null
    try {
        const json = JSON.parse(line)
        const text = json?.message?.content
        const done = json?.done
        const usage = json?.eval_count != null
        ? {
            prompt_tokens: json.prompt_eval_count || 0,
            completion_tokens: json.eval_count || 0,
            total_tokens: (json.prompt_eval_count || 0) + (json.eval_count || 0)
        }
        : undefined
        const metrics: Metrics | undefined = json?.total_duration != null
            ? (() => {
                const totalTime = json.total_duration / 1e6
                const endTime = performance.now()
                return {
                    startTime: endTime - totalTime,
                    endTime,
                    totalTime,
                    timeToFirstChunk: (json.total_duration - json.eval_duration) / 1e6,
                    streamingTime: json.eval_duration / 1e6,
                    tokensPerSecond: json.eval_duration
                        ? json.eval_count / (json.eval_duration / 1e9)
                        : undefined,
                }
            })()
            : undefined
        return {
            text,
            done,
            usage,
            metrics
        }
    } catch(error) {
        console.log("Error parsing JSON: ", error)
        return null
    }
}