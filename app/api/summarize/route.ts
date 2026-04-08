import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { text } = await req.json()
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
                    content: text,
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
    const summary = data.choices[0]?.message?.content || "Summary not available";
    return Response.json({ summary });
}