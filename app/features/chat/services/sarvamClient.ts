
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

    const reader = res.body.getReader();
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