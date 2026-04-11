import { processStream } from "@/app/features/chat/utils/processStream"
import { describe, expect, it } from "vitest"

export function createSSEStream(events: string[]){
    let index=0
    return new ReadableStream({
        pull(controller) {
            if(index < events.length){
                controller.enqueue(
                    new TextEncoder().encode(events[index] + '\n')
                )
                index++
            } else {
                controller.close()
            }
        }
    })
}

describe("Stream", () => {
    it("should process streamed chunk in order", async() => {
        const stream = createSSEStream([
            'data: {"choices":[{"delta":{"content":"Hel"}}]}',
            'data: {"choices":[{"delta":{"content":"lo"}}]}',
            'data: [DONE]'
        ])
        let result = ""

        await processStream(stream, (chunk) => {
            result += chunk
        })

        expect(result).toBe("Hello")
    })
    it("should call the onChunk callback for each chunk", async () => {
        const stream = createSSEStream([
            'data: {"choices":[{"delta":{"content":"A"}}]}',
            'data: {"choices":[{"delta":{"content":"B"}}]}',
            'data: [DONE]'
        ])

        const calls: string[] = []

        await processStream(stream, (chunk) => {
            calls.push(chunk)
        })

        expect(calls).toEqual(["A", "B"])
    })
    it("should ignore invalid JSON without crash", async () => {
        const stream = createSSEStream([
            'data: asdfsdf',
            'data: {"choices":[{"delta":{"content":"A"}}]}',
            'data: [DONE]'
        ])

        let result = ""

        await processStream(stream, (chunk) => {
            result += chunk
        })

        expect(result).toBe("A")
    })
    it("should pass usage data on completion", async() => {
        const stream = createSSEStream([
            'data: {"choices":[{"delta":{"content":"Hi"}}]}',
            'data: {"choices": [], "usage":{"completion_tokens":660,"prompt_tokens":1033,"total_tokens":1693,"completion_tokens_details":null,"prompt_tokens_details":null,"reasoning_tokens":0}}',
            'data: [DONE]'
        ])

        let usage:{ prompt_tokens: number, completion_tokens: number, total_tokens: number}

        await processStream(stream, () => {}, u => {usage = u})
        expect(usage).toBeDefined()
        expect(usage!.total_tokens).toBe(1693)
    })

    it("should handle chunked data across boundaries", async () => {
        const encoder = new TextEncoder();

        const full = 'data: {"choices":[{"delta":{"content":"A"}}]}\n';

        const stream = new ReadableStream({
            start(controller) {
            controller.enqueue(encoder.encode(full.slice(0, 15)));
            controller.enqueue(encoder.encode(full.slice(15)));
            controller.enqueue(encoder.encode('data: [DONE]\n'));
            controller.close();
            }
        });

        let result = "";

        await processStream(stream, (chunk) => {
            result += chunk;
        });

        expect(result).toBe("A");
    });

    it("should complete when stream ends without DONE", async () => {
        const stream = createSSEStream([
            'data: {"choices":[{"delta":{"content":"A"}}]}'
        ]);

        let result = "";

        await processStream(stream, (chunk) => {
            result += chunk;
        });

        expect(result).toBe("A");
    });
    it("should handle multiple events in a single chunk", async () => {
        const encoder = new TextEncoder()
        const combined =
            'data: {"choices":[{"delta":{"content":"A"}}]}\n' +
            'data: {"choices":[{"delta":{"content":"B"}}]}\n' +
            'data: [DONE]\n';

        const stream =  new ReadableStream({
            start(controller) {
                controller.enqueue(encoder.encode(combined))
                controller.close()
            }
        })

        let result = ""

        await processStream(stream, (chunk) => {
            result += chunk
        })

        expect(result).toBe("AB")
    })

})
