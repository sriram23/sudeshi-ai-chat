
export async function streamChat(
    messages: { role: string; content: string }[],
    model: string = "sarvam-30b",
    onChunk: (chunk: string) => void,
    signal?: AbortSignal
) {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
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
                return;
            }
            try {
                const json = JSON.parse(data);

                const text = json?.choices[0]?.delta?.content || json?.choices[0]?.message?.content || "";
                if(text) {
                    await delay(100);
                    onChunk(text);
                }
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        }
    }
}