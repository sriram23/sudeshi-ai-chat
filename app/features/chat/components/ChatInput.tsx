import { stat } from "fs";

const ChatInput = ({ input, setInput, status, sendMessage, stopStreaming }:{ input: string; setInput: (value: string) => void; status: string; sendMessage: (value: string) => void; stopStreaming: () => void }) => {
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
            <div className="absolute right-0 bottom-0">
                {status === "idle" && (
                    <button onClick={() => { sendMessage(input); setInput(""); }} className="mt-2 p-2 rounded text-white bg-zinc-800">
                        Send
                    </button>
                )}
                {status === "streaming" && (
                    <button onClick={stopStreaming} className="mt-2 p-2 rounded bg-red-500 text-white">
                        Stop Streaming
                    </button>
                )}
            </div>
        </div>
    )
}

export default ChatInput;