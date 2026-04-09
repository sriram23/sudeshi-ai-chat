import { CircleAlert, Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRender";

const AssistantChatBubble = ({ message, currentResponse, usage, status, error }: { message?: string, currentResponse?: string, usage?: { total_tokens: number, prompt_tokens: number, completion_tokens: number }, status: string, error?: boolean }) => {
    return (
        <div className="flex flex-col justify-start max-w-3xl">
            {status === "streaming" && (
                <div className="p-2 m-1 rounded font-extralight italic self-start">
                    {currentResponse?.length ? "Responding..." : "Thinking..."}
                </div>
            )}
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
                    <button><Copy size={16}/></button>
                    <button><ThumbsUp size={16} /></button>
                    <button><ThumbsDown size={16} /></button>
                </div>
            )}
            {usage && (
                <div className="mx-1 px-4 text-xs text-gray-500 mt-1">
                    Tokens usage: {usage.total_tokens} (Prompt: {usage.prompt_tokens}, Completion: {usage.completion_tokens})
                </div>
            )}
        </div>
    );
}

export default AssistantChatBubble;