import { OllamaAdapter } from "./OllamaAdapter"
import { SarvamAdapter } from "./SarvamAdapter"

export function getAdapter(config: {
    provider: "ollama" | "sarvam"
    model: string
    endpoint?: string
}) {
    switch(config.provider) {
        case "ollama":
            if(!config.endpoint) throw new Error("Missing Endpoint")
            return new OllamaAdapter(config.endpoint, config.model)
        case "sarvam":
            return new SarvamAdapter(config.model)
        default:
            throw new Error("Unsupported Provider")
    }
}