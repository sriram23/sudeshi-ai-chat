import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { messages, model } = await req.json()
    const response = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            messages,
            model,
            stream: true
        })
    })
    return new Response(response.body, {
        headers: {
            "Content-Type": "text/event-stream",
        }
    })
}