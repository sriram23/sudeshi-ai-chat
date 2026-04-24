import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { messages, model, endpoint } = await req.json()
    if(endpoint) {
        const response = await fetch(`${endpoint}/api/chat`, {
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
    } else {
        return new Response("No endpoint provided.", {status: 400})
    }
}