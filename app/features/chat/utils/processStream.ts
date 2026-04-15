export async function processStream(stream:ReadableStream, onChunk: (chunk: string) => void, onComplete?:(usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number }) => void) {
    // const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
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
            if(!line.startsWith("data:")) continue

            const data = line.replace(/^data:\s*/, "");
            if (data === "[DONE]") {
                console.log("Stream signaled done");
                if (onComplete) onComplete(usage);
                return;
            }
            try {
                const json = JSON.parse(data);

                const text = json?.choices[0]?.delta?.content || json?.choices[0]?.message?.content || "";
                if(text) {
                    // await delay(50); // slight delay to allow UI to catch up
                    onChunk(text);
                }

                // Capture usage if present
                if (json.usage) {
                    usage = json.usage;
                }
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        }
    }
}
