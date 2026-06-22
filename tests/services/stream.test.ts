import { processStream, sseParser, ollamaParser } from "@/app/features/chat/utils/processStream"
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

export function createOllamaStream(events: string[]){
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

describe("SSE Stream", () => {
    it("should process streamed chunk in order", async() => {
        const stream = createSSEStream([
            'data: {"choices":[{"delta":{"content":"Hel"}}]}',
            'data: {"choices":[{"delta":{"content":"lo"}}]}',
            'data: [DONE]'
        ])
        let result = ""

        await processStream(stream, sseParser, (chunk) => {
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

        await processStream(stream, sseParser, (chunk) => {
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

        await processStream(stream, sseParser, (chunk) => {
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

        await processStream(stream, sseParser, () => {}, u => {usage = u})
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

        await processStream(stream, sseParser, (chunk) => {
            result += chunk;
        });

        expect(result).toBe("A");
    });

    it("should complete when stream ends without DONE", async () => {
        const stream = createSSEStream([
            'data: {"choices":[{"delta":{"content":"A"}}]}'
        ]);

        let result = "";

        await processStream(stream, sseParser, (chunk) => {
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

        await processStream(stream, sseParser, (chunk) => {
            result += chunk
        })

        expect(result).toBe("AB")
    })

})

describe("Ollama Stream", () => {
    it("should call onchunk for each Ollama chunk", async () => {
        const stream = createOllamaStream([
            '{"message": {"content": "A"}}',
            '{"message": {"content": "B"}, "done": true}',
        ])

        const calls: string[] = []

        await processStream(stream, ollamaParser, (chunk) => {
            calls.push(chunk)
        })

        expect(calls).toEqual(["A", "B"])
    })
    it("should ignore invalid Ollama JSON", async () => {
        const stream = createOllamaStream([
            'asdfghjkl',
            '{"message": {"content": "A"}, "done": true}',
        ])

        let result = ""

        await processStream(stream, ollamaParser, (chunk) => {
            result += chunk
        })

        expect(result).toBe("A")
    })
    it("should handle chunk boundaries", async () => {
        const encoder = new TextEncoder()
        const full = '{"message": {"content": "Hello"}, "done": true}\n';
        const stream = new ReadableStream({

            start(controller) {
                controller.enqueue(encoder.encode(full.slice(0, 20)));
                controller.enqueue(encoder.encode(full.slice(20)));
                controller.close()
            }
        })
        let result = ""

        await processStream(stream, ollamaParser, (chunk) => {
            result += chunk
        })
        expect(result).toBe("Hello")
    })
    it("should process multiple JSON events in a single chunk", async () => {
        const encode = new TextEncoder()
        const combined = 
            '{"message": {"content": "A"}}\n' +
            '{"message": {"content": "B"}}\n' +
            '{"message": {"content": "C"}, "done": true}\n';
        const stream = new ReadableStream({
            start(controller) {
                controller.enqueue(encode.encode(combined))
                controller.close()
            }
        })

        let result = ""
        await processStream(stream, ollamaParser, (chunk) => {
            result += chunk
        })

        expect(result).toBe("ABC")
    })
    it("should complete when stream ends without done=true", async () => {
        const stream = createOllamaStream([
            '{"message": {"content": "Hello"}}'
        ])
        let result = ""

        await processStream(stream, ollamaParser, (chunk) => {
            result += chunk
        })

        expect(result).toBe("Hello")
    })
    it("should ignore empty message content", async () => {
        const stream = createOllamaStream([
            '{"message": {"content": ""}}',
            '{"message": {"content": "Hello"}, "done": true}'
        ])
        
        let result = ""
        await processStream(stream, ollamaParser, (chunk) => {
            result += chunk
        })
        expect(result).toBe("Hello")
    })
    it("should handle done=true without content", async () => {
        const stream = createOllamaStream([
            '{"done": true}'
        ])

        let result = ""
        await processStream(stream, ollamaParser, (chunk) => {
            result += chunk
        })
        expect(result).toBe("")
    })
})
