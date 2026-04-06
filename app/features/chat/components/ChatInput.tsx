import { Send, Square } from "lucide-react";

const ChatInput = ({ input, setInput, settings, setSettings, status, sendMessage, stopStreaming }:{ input: string; setInput: (value: string) => void; settings: { model: "sarvam-30b" | "sarvam-105b" }; setSettings: (newSettings: { model: "sarvam-30b" | "sarvam-105b" }) => void; status: string; sendMessage: (value: string, model: string) => void; stopStreaming: () => void }) => {
    const handleInputHeight = (e: React.FormEvent<HTMLTextAreaElement>) => {
        const textarea = e.currentTarget;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
    }
    return (
        <div className="w-full flex flex-col relative">
            {status === "error" && (
                <div className="p-2 mb-2 rounded bg-red-100 text-red-800">
                    An error occurred while streaming. Please try again.
                </div>
            )}
            <textarea onInput={handleInputHeight} value={input} onChange={(e) => setInput(e.target.value)} rows={1} className="no-scrollbar focus-visible:ring-2 focus:outline-none focus-visible:ring-blue-500 mt-auto min-h-10 max-h-32 h-full p-2 border rounded resize-none" placeholder="Type your message..."/>
            <div className="absolute right-2 bottom-1">
                <select onChange={(e) => setSettings({ model: e.target.value as "sarvam-30b" | "sarvam-105b" })} value={settings?.model} className="mr-2 p-1 border rounded">
                    <option value="sarvam-30b">Sarvam 30B</option>
                    <option value="sarvam-105b">Sarvam 105B</option>
                </select>
                {status === "idle" && (
                    <button onClick={() => { sendMessage(input, settings.model); setInput(""); }} className="mt-2 p-2 rounded-full text-white bg-zinc-800">
                        <Send size={16} />
                    </button>
                )}
                {status === "streaming" && (
                    <button onClick={stopStreaming} className="mt-2 p-2 rounded bg-red-500 text-white">
                        <Square size={16} />
                    </button>
                )}
            </div>
        </div>
    )
}

export default ChatInput;