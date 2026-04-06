import { NextRequest } from "next/server";
export async function POST(req: NextRequest) {
    const { messages, model } = await req.json();
    const response = await fetch("https://api.sarvam.ai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.SARVAM_API_KEY}`,
        },
        body: JSON.stringify({
            messages: messages,
            stream: true,
            model: model || "sarvam-30b"
        })
    });
    return new Response(response.body, {
        headers: {
            "Content-Type": "text/event-stream",
        },
    });
}