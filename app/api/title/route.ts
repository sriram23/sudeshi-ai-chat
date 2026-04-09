import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { message } = await req.json()
    const response = await fetch("https://api.sarvam.ai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.SARVAM_API_KEY}`,
        },
        body: JSON.stringify({
            messages: [
                {
                    role: "system",
                    content: `Generate a concise and descriptive title for the following conversation:\n\n${message}`,
                }
            ],
            model: "sarvam-30b",
        })
    });
    if (!response.ok) {
        const errorData = await response.json();
        console.error("Error from Sarvam API:", errorData);
        return Response.json({ error: errorData }, { status: response.status });
    }
    const data = await response.json();
    const title = data.choices[0]?.message?.content || "Untitled Conversation";
    return Response.json({ title });
}