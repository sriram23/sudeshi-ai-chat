
export async function GET() {
    try {
        const response = await fetch("http://localhost:11434/api/tags", {
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        return new Response(JSON.stringify(data), {
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        console.error("Error fetching Ollama models:", error);
        return new Response("Error fetching Ollama models", { status: 500 });
    }
}