import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { messages, model, endpoint } = await req.json()
    if(endpoint) {
        const url = new URL("/api/chat", endpoint)
        if(url.protocol !== "https:" && url.hostname !== "localhost"){
            throw new Error("Only HTTPS endpoints are allowed")
        }
        if(!["443", "80", "11434", "3000", "8080"].includes(url.port) ){
            throw new Error("Current port usage is restricted")
        }
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages,
                model,
                stream: true
            }),
            redirect: "error",
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