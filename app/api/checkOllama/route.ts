import { buildEndpointUrl } from "@/lib/validateEnpoint";
import { NextRequest } from "next/server";
export async function POST(req: NextRequest) {
    const {endpoint} = await req.json();
    if(endpoint) {
        try {
            const url = buildEndpointUrl(endpoint, "/api/tags");
            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                },
                redirect: "error",
                signal: AbortSignal.timeout(10000)
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
    } else {
        return new Response("No endpoint provided.", {status: 400})
    }
}