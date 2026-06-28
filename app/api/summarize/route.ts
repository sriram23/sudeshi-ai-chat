import { NextRequest } from "next/server";

type SarvamContentItem = {
    type?: string;
    text?: string;
};

type SarvamMessage = {
    content?: string | SarvamContentItem[];
    reasoning_content?: string | null;
};

type SarvamResponse = {
    choices?: Array<{
        message?: SarvamMessage;
    }>;
};

export function extractSummaryFromResponse(data: SarvamResponse): string | null {
    const message = data.choices?.[0]?.message;
    const content = message?.content;

    if (typeof content === "string") {
        return content.trim() ? content.trim() : null;
    }

    if (Array.isArray(content)) {
        const textContent = content.find((item) => item.type === "text" || item.text)?.text;
        return textContent?.trim() ? textContent : null;
    }

    const reasoningContent = message?.reasoning_content;
    if (typeof reasoningContent === "string") {
        return reasoningContent.trim() ? reasoningContent.trim() : null;
    }

    return null;
}

export async function POST(req: NextRequest) {
    const { text } = await req.json()
    const response = await fetch("https://api.sarvam.ai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.SARVAM_API_KEY}`,
            "api-subscription-key": process.env.SARVAM_SUBSCRIPTION_KEY ?? "",
        },
        body: JSON.stringify({
            messages: [
                {
                    role: "system",
                    content: text,
                }
            ],
            model: "sarvam-30b",
            temperature: 0,
            max_tokens: 128,
            top_p: 1,
            frequency_penalty: 0.2
        })
    });
    if (!response.ok) {
        const errorData = await response.json();
        console.error("Error from Sarvam API:", errorData);
        return Response.json({ error: errorData }, { status: response.status });
    }

    const data = await response.json() as SarvamResponse;
    const summary = extractSummaryFromResponse(data);
    if (!summary) {
        return Response.json(
            { error: "Empty summary returned from model." },
            { status: 502 }
        );
    }
    return Response.json({ summary });
}
