import {
    BadgeCheck,
    ChartNoAxesColumnIncreasing,
    ClockAlert,
    Copy,
    Info,
    OctagonAlert,
    TrendingUp,
    TriangleAlert,
} from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRender";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useState, memo } from "react";
import CustomSpinner from "./CustomSpinner";
import { MessageStatus, Metrics } from "../types/chat.types";
import MetricsCard from "./MetricsCard";
import { useChatStore } from "@/store/chatStore";
import { SUMMARIZE_TOKEN_THRESHOLD } from "../utils/constants";
import Image from "next/image";
import LOGO from "@/app/assets/images/Sudeshi_Chat.png"

const AssistantChatBubble = memo(({ message, thinking, currentResponse, currentThinking, usage, metrics, status, msgStatus }: { message?: string, thinking?: string, currentResponse?: string, currentThinking?: string, usage?: { total_tokens: number, prompt_tokens: number, completion_tokens: number, prompt_cost?: number, completion_cost?: number, total_cost?: number }, metrics?:Metrics, status: string, msgStatus?: MessageStatus }) => {
    const contextThresholdExceeded = useChatStore((state) => {
        const activeId = state.activeConversationId;
        const lastMessage = state.conversations.find((conv) => conv.id === activeId)?.messages.at(-1);
        const tokenUsage = lastMessage?.usage;
        const totalToken = tokenUsage?.total_tokens || 0;
        return totalToken > SUMMARIZE_TOKEN_THRESHOLD;
    });
    const [showAlert, setShowAlert] = useState(false);
    const [showMetric, setShowMetric] = useState(false)
    const [alertMessage, setAlertMessage] = useState({type: "success", text: ""});
    const [showThinking, setShowThinking] = useState(false);
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
                {currentThinking && !currentResponse && (
                    <div className="p-2 pl-4 py-3 my-1 rounded self-start max-w-3xl bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800">
                        <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Thinking</div>
                        <span className="text-xs font-light"><MarkdownRenderer content={currentThinking} /></span>
                    </div>
                )}
                {currentResponse && (
                    <div className="p-2 pl-4 py-3 my-1 rounded self-start max-w-3xl">
                        <span><MarkdownRenderer content={currentResponse} /></span>
                        {status === "streaming" && <CustomSpinner className="text-gray-800" />}
                    </div>
                )}
                {message && (
                    <div className="p-2 pl-4 py-3 my-1 rounded self-start max-w-3xl">
                        <div className="flex mb-2">
                            <Image className="dark:invert" src={LOGO} alt="Sudeshi Logo" width={25} height={25} />
                            <span className="ml-2 text-md text-zinc-500 dark:text-zinc-400">Sudeshi</span>
                        </div>
                        {thinking && (
                            <div className="mb-3 rounded-md bg-zinc-100 dark:bg-zinc-900/80 p-3 text-sm text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
                                <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 flex justify-between w-full"><div>Thinking</div><button onClick={() => setShowThinking(!showThinking)}>{showThinking? "Hide" : "Show"}</button></div>
                                {showThinking && <span className="text-xs font-light"><MarkdownRenderer content={thinking} /></span>}
                            </div>
                        )}
                        <MarkdownRenderer content={message} />
                    </div>
                )}
            </div>
            {status === "idle" && (
                <div className="flex gap-2 mx-1 px-4 mb-2">
                    <button title="Copy Response" aria-label="Copy Response" className="hover:bg-zinc-200 p-1 rounded-lg" onClick={handleCopy}><Copy size={16}/></button>
                    {usage && <button title="Metrics" aria-label="Metrics" className={`${showMetric ? "bg-zinc-200 " : ""}hover:bg-zinc-200 p-1 rounded-lg`} onClick={() => setShowMetric(!showMetric)}><ChartNoAxesColumnIncreasing size={16} /></button>}
                    <div
                        title={
                            msgStatus
                                ? contextThresholdExceeded
                                    ? "High token usage"
                                    : msgStatus
                                : undefined
                        }
                        className="
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-md
                            px-2
                            py-1
                            text-xs
                            font-medium
                            bg-zinc-100
                            text-zinc-500
                            dark:bg-zinc-800
                            dark:text-zinc-400
                        "
                    >
                        {msgStatus === "pending" ? (
                            <>
                                <ClockAlert size={14} className="text-yellow-500" />
                                <span>Pending</span>
                            </>
                        ) : msgStatus === "cancelled" ? (
                            <>
                                <TriangleAlert size={14} className="text-yellow-500" />
                                <span>Cancelled</span>
                            </>
                        ) : msgStatus === "error" ? (
                            <>
                                <OctagonAlert size={14} className="text-red-500" />
                                <span>Error</span>
                            </>
                        ) : contextThresholdExceeded ? (
                            <>
                                <TrendingUp size={14} className="text-orange-500" />
                                <span>High token usage</span>
                            </>
                        ) : (
                            <>
                                <BadgeCheck size={14} className="text-green-500" />
                                <span>Completed</span>
                            </>
                        )}
                    </div>
                </div>
            )}
            {usage && showMetric && (
                <div className="flex flex-col m-4 max-w-xl">
                    <MetricsCard totalToken={usage.total_tokens} promptToken={usage.prompt_tokens} completionToken={usage.completion_tokens} totalTime={metrics?.totalTime} totalCost={usage?.total_cost ?? 0} promptTokenCost={usage?.prompt_cost ?? 0} completionTokenCost={usage?.completion_cost ?? 0} tokenSpeed={metrics?.tokensPerSecond} firstChunk={metrics?.timeToFirstChunk} streaming={metrics?.streamingTime}  />
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