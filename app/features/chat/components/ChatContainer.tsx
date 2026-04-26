"use client";
import { useChatStore } from "@/store/chatStore";
import { useChat } from "../hooks/useChat";
import { useRef, useState, useMemo } from "react";
import ChatInput from "./ChatInput";
import GuideComponent from "./GuideComponent";
import UserChatBubble from "./UserChatBubble";
import AssistantChatBubble from "./AssistantChatBubble";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { Spinner } from "@/components/ui/spinner";
import ChatHeader from "./ChatHeader";
import OfflineComponent from "./OfflineComponent";
import { ArrowDown } from "lucide-react";

const ChatContainer = () => {
    const [isAtBottom, setIsAtBottom] = useState(true);
    const { sendMessage, stopStreaming } = useChat();
    const conversations = useChatStore(s => s.conversations)
    const activeConversationId = useChatStore(s=>s.activeConversationId)
    const currentResponse = useChatStore(s => s.currentResponse)
    const status = useChatStore(s => s.status)
    const settings = useChatStore(s => s.settings)

    const virtuosoRef = useRef<VirtuosoHandle | null>(null)

    const activeConversation = useMemo(() => conversations.find(c => c.id === activeConversationId),[conversations, activeConversationId]);

    const messages = activeConversation?.messages || [];

    const totalCount = messages.length + (status === "streaming" ? 1 : 0);
    return (
        <div className="relative flex flex-col min-h-screen h-full w-full m-0 flex-1 bg-linear-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
            <div className="flex items-top sticky top-0 z-10 pt-4 bg-zinc-100 dark:bg-zinc-950 mb-4">
                <ChatHeader />
            </div>

            {/* Empty states */}
            {!activeConversationId || !messages.length ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 w-full">
                    <GuideComponent onMessageSend={(msg: string) => sendMessage(msg)} />
                </div>
            ) : null}

            {/* Chat list */}
            {activeConversation && messages.length > 0 && (
                <Virtuoso
                    ref={virtuosoRef}
                    style={{ flex: 1 }}
                    totalCount={totalCount}
                    className="flex-1 w-full"
                    // listen scroll at bottom
                    atBottomStateChange={(atBottom) => setIsAtBottom(atBottom)}

                    // Smart auto-scroll
                    followOutput={(isAtBottom) => {
                        if (!isAtBottom) return false;
                        return status === "streaming" ? "auto" : false;
                    }}

                    itemContent={(i) => {
                        // Streaming message as real item and no Footer hack
                        if (i === messages.length && status === "streaming") {
                            return (
                                <div className="p-2 flex justify-start">
                                    <AssistantChatBubble
                                        currentResponse={currentResponse}
                                        status={status}
                                    />
                                </div>
                            );
                        }

                        const msg = messages[i];

                        return (
                            <div className="flex flex-col">
                                <div className={`flex items-center ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    {msg.role === "user" ? (
                                        <UserChatBubble
                                            key={msg.id}
                                            message={msg.content}
                                            showEdit={status === "idle" && i === messages.length - 2}
                                            onEditSave={(newMessage) => sendMessage(newMessage)}
                                        />
                                    ) : (
                                        <AssistantChatBubble
                                            message={msg.content}
                                            error={msg.status === "error"}
                                            usage={msg.usage}
                                            metrics={msg.metrics}
                                            status={status}
                                            settings={settings}
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    }}
                />
            )}

            {!isAtBottom && conversations.filter(c => c.id === activeConversationId) && (
                <button
                    className="absolute bottom-36 left-1/2 bg-zinc-800 text-white px-3 py-2 rounded-full shadow-md"
                    onClick={() => {
                        virtuosoRef.current?.scrollToIndex({
                            index: totalCount,
                            behavior: "smooth",
                        });
                    }}
                >
                    <ArrowDown size={16}/>
                </button>
            )}

            {/* Input */}
            <div className="sticky bottom-0 p-4 w-full">
                {status === "streaming" && (currentResponse.length === 0 ? <div className="text-gray-500 flex gap-2 items-center"><Spinner />Thinking...</div> : <div className="text-gray-500 flex gap-2 items-center"><Spinner />Answering...</div>)}
                <div className=" w-full rounded-xl bg-zinc-100 dark:bg-zinc-950">
                    <ChatInput status={status} sendMessage={(msg) => {
                        sendMessage(msg)
                        virtuosoRef.current?.scrollToIndex({
                            index: totalCount,
                            behavior: "auto"
                        })
                    }}
                    stopStreaming={stopStreaming} />
                </div>
            </div>
            <OfflineComponent />
        </div>
    );
}

export default ChatContainer;