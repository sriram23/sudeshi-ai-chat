import { CircleAlert, Copy, Info, ThumbsDown, ThumbsUp } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRender";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useState, memo } from "react";
const AssistantChatBubble = memo(({ message, currentResponse, usage, status, error }: { message?: string, currentResponse?: string, usage?: { total_tokens: number, prompt_tokens: number, completion_tokens: number }, status: string, error?: boolean }) => {
    console.log("Rendering bubble: ", message?.slice(0,20)+"...")
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState({type: "success", text: ""});
    const handleCopy = () => {
        if (message) {
            try{
                navigator.clipboard.writeText(message);
                setAlertMessage({type: "success", text: "Response copied to clipboard!"});
                setShowAlert(true);
                setTimeout(() => {setShowAlert(false);}, 4000);
            }
            catch(err){
                console.error("Failed to copy text: ", err);
                setAlertMessage({type: "destructive", text: "Failed to copy response."});
                setShowAlert(true);
                setTimeout(() => {setShowAlert(false);}, 4000);
            }
        }
    };

    return (
        <div className="flex flex-col justify-start max-w-3xl">
            <div className="flex items-center text-gray-900 dark:text-gray-100 px-2 m-1 rounded-lg">
                {currentResponse && (
                    <div className="p-2 my-1 rounded self-start">
                        <MarkdownRenderer content={currentResponse} />
                    </div>
                )}
                {message && (
                    <div className="p-2 my-1 rounded self-start">
                        <MarkdownRenderer content={message} />
                    </div>
                )}
                {status === "idle" && error && (<CircleAlert color="red" />)}
            </div>
            {status === "idle" && (
                <div className="flex gap-2 mx-1 px-4 mb-2">
                    <button aria-label="Copy Response" onClick={handleCopy}><Copy size={16}/></button>
                    <button aria-label="Like"><ThumbsUp size={16} /></button>
                    <button aria-label="Dislike"><ThumbsDown size={16} /></button>
                </div>
            )}
            {usage && (
                <div className="mx-1 px-4 text-xs text-gray-500 mt-1">
                    Tokens usage: {usage.total_tokens} (Prompt: {usage.prompt_tokens}, Completion: {usage.completion_tokens})
                </div>
            )}
            <Alert className={`fixed max-w-md top-4 right-4 z-50 ${alertMessage.type === "destructive" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"} ${showAlert ? "block" : "hidden"}`}>
                <AlertTitle><span className="flex items-center gap-2"><Info size={16} /> {alertMessage.text}</span></AlertTitle>
            </Alert>
        </div>
    );
}
);

AssistantChatBubble.displayName = "AssistantChatBubble";

export default AssistantChatBubble;