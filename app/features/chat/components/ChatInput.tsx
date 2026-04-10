import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowUp, ChevronDown, Square } from "lucide-react";

const ChatInput = ({ input, setInput, settings, setSettings, status, sendMessage, stopStreaming }:{ input: string; setInput: (value: string) => void; settings: { model: "sarvam-30b" | "sarvam-105b" }; setSettings: (newSettings: { model: "sarvam-30b" | "sarvam-105b" }) => void; status: string; sendMessage: (value: string) => void; stopStreaming: () => void }) => {
    const handleInputHeight = (e: React.FormEvent<HTMLTextAreaElement>) => {
        const textarea = e.currentTarget;
        const parentDiv = textarea.parentElement;
        if (parentDiv) {
            const grandParentDiv = parentDiv.parentElement;
            if (grandParentDiv) {
                grandParentDiv.style.border = "1px solid #27272A"
            }
        }
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
    }

    const handleBlur = (e: React.FormEvent<HTMLTextAreaElement>) => {
        const textarea = e.currentTarget
        const parentDiv = textarea.parentElement
        if(parentDiv){
            const grandParentDiv = parentDiv.parentElement
            if(grandParentDiv) {
                grandParentDiv.style.border = "1px solid #18181B"
            }
        }
    }

    const handleSend = () => {
        if (status === "streaming") return; // Prevent sending new messages while streaming
        if(!input.trim()) return;
        sendMessage(input);
        setInput("");
    }
    return (
        <div className="w-full flex flex-col relative">
            {status === "error" && (
                <div className="p-2 mb-2 rounded bg-red-100 text-red-800">
                    An error occurred while streaming. Please try again.
                </div>
            )}
            <div className="flex justify-between items-center flex-1 w-full border p-4 rounded-xl">
                <div className="flex-4">
                    <textarea style={{ width: "100%", border: "none"}} onKeyDown={(e) => {
                        if(e.key === "Enter" && !e.shiftKey){
                            e.preventDefault()
                            handleSend();
                        }
                    }} onFocus={handleInputHeight} onBlur={handleBlur} value={input} onChange={(e) => setInput(e.target.value)} rows={1} className="no-scrollbar focus-visible:ring-2 focus:outline-none focus-visible:ring-transparent mt-auto min-h-10 max-h-32 h-full p-2 border rounded-lg resize-none" placeholder="Type your message..."/>
                </div>
                <div className="m-2 px-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger render={<button className="border rounded-2xl p-2" />}>
                            <span className="flex justify-between items-center">{settings.model === "sarvam-30b" ? "Sarvam 30B": settings.model === "sarvam-105b" ? "Sarvam 150B": settings.model} <ChevronDown/></span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white dark:bg-zinc-950">
                            <DropdownMenuGroup>
                                <DropdownMenuItem className="hover:bg-gray-200 dark:hover:bg-zinc-800" onClick={() => setSettings({model: "sarvam-30b"})}>Sarvam 30B</DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-gray-200 dark:hover:bg-zinc-800" onClick={() => setSettings({model: "sarvam-105b"})}>Sarvam 150B</DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                {status === "idle" && (
                    <button onClick={() => { sendMessage(input); setInput(""); }} className="my-1 p-2 rounded-full text-white bg-zinc-800">
                        <ArrowUp size={16} />
                    </button>
                )}
                {status === "streaming" && (
                    <button onClick={stopStreaming} className="my-1 p-2 rounded bg-red-500 text-white">
                        <Square size={16} />
                    </button>
                )}
            </div>
        </div>
    )
}

export default ChatInput;