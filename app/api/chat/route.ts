import { NextRequest } from "next/server";
export async function POST(req: NextRequest) {
    const { message } = await req.json();
    console.log("Received message:", message);
    const response = await fetch("https://api.sarvam.ai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.SARVAM_API_KEY}`,
        },
        body: JSON.stringify({
            messages: [{role: "user", content: message}],
            stream: true,
            model: "sarvam-105b"
        })
    });
    console.log("Response from Sarvam API received:", response);
    return new Response(response.body, {
        headers: {
            "Content-Type": "text/event-stream",
        },
    });
}