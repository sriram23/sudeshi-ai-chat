import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowUp, Square } from "lucide-react";
import { memo, useState } from "react";

const ChatInput = memo(
    ({
        status,
        sendMessage,
        stopStreaming,
    }: {
        status: string;
        sendMessage: (value: string) => void;
        stopStreaming: () => void;
    }) => {
        const [input, setInput] = useState("");
        const isMobile = useIsMobile();

        const handleInputHeight = (
            e: React.FormEvent<HTMLTextAreaElement>
        ) => {
            const textarea = e.currentTarget;

            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        };

        const handleSend = () => {
            if (status === "streaming") return;
            if (!input.trim()) return;

            sendMessage(input);
            setInput("");
        };

        return (
            <div className="w-full flex flex-col relative">
                {status === "error" && (
                    <div className="p-2 mb-2 rounded bg-red-100 text-red-800">
                        An error occurred while streaming. Please try again.
                    </div>
                )}

                <div
                    className="
                        flex
                        justify-between
                        items-center
                        flex-1
                        w-full
                        border
                        border-zinc-300
                        dark:border-zinc-700
                        focus-within:border-zinc-900
                        dark:focus-within:border-zinc-100
                        p-4
                        rounded-xl
                        transition-colors
                    "
                >
                    <div className="flex-4">
                        <textarea
                            style={{ width: "100%" }}
                            onKeyDown={(e) => {
                                if (isMobile) return;

                                if (
                                    e.key === "Enter" &&
                                    !e.shiftKey
                                ) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            onInput={handleInputHeight}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            rows={1}
                            className="
                                no-scrollbar
                                w-full
                                min-h-10
                                max-h-32
                                h-full
                                p-2
                                border-0
                                outline-none
                                resize-none
                                bg-transparent
                                focus:outline-none
                                focus:ring-0
                            "
                            placeholder="Ask Sudeshi Anything..."
                        />
                    </div>

                    {status === "idle" && (
                        <button
                            aria-label="Send Message"
                            onClick={() => {
                                sendMessage(input);
                                setInput("");
                            }}
                            className="my-1 p-2 rounded-full text-white bg-zinc-800"
                        >
                            <ArrowUp size={16} />
                        </button>
                    )}

                    {status === "streaming" && (
                        <button
                            aria-label="Cancel Response"
                            onClick={stopStreaming}
                            className="my-1 p-2 rounded bg-red-500 text-white"
                        >
                            <Square size={16} />
                        </button>
                    )}
                </div>
            </div>
        );
    }
);

ChatInput.displayName = "ChatInput";

export default ChatInput;
