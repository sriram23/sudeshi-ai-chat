type Usage = {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
};

type ParserResult = {
  text?: string;
  done?: boolean;
  usage?: Usage;
};

type StreamParser = (line: string) => ParserResult | null;

export async function processStream(stream:ReadableStream, parser:StreamParser, onChunk: (chunk: string) => void, onComplete?:(usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number }) => void) {
    const reader = stream.getReader()
    const decoder = new TextDecoder("utf-8");

    let buffer = "";
    let usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number } | undefined;

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
            }
            if(result.done) {
                onComplete?.(usage)
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
        const usage = json?.eval_count
        ? {
            prompt_tokens: json.prompt_eval_count || 0,
            completion_tokens: json.eval_count || 0,
            total_tokens: (json.prompt_eval_count || 0) + (json.eval_count || 0)
        }
        : undefined
        return {
            text,
            done,
            usage
        }
    } catch(error) {
        console.log("Error parsing JSON: ", error)
        return null
    }
}