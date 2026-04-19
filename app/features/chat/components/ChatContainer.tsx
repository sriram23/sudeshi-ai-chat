"use client";
import { useChatStore } from "@/store/chatStore";
import { useChat } from "../hooks/useChat";
import { useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import GuideComponent from "./GuideComponent";
import UserChatBubble from "./UserChatBubble";
import AssistantChatBubble from "./AssistantChatBubble";
import { Virtuoso } from "react-virtuoso";
import { Spinner } from "@/components/ui/spinner";
import ChatHeader from "./ChatHeader";
import OfflineComponent from "./OfflineComponent";

const ChatContainer = () => {
    const { sendMessage, stopStreaming } = useChat();
    const { conversations, activeConversationId,  currentResponse, status, settings } = useChatStore();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [currentResponse, status]);
    return (
        <div className="flex flex-col min-h-screen h-full w-full m-0 flex-1 bg-linear-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
            <div className="flex items-top sticky top-0 z-10 pt-4 bg-zinc-100 dark:bg-zinc-950 mb-4">
                <ChatHeader />
            </div>
            {
                conversations.filter(c => c.id === activeConversationId).map(conv => !conv.messages.length ? (<div key={conv.id} className="flex-1 flex flex-col items-center justify-center text-gray-500 w-full"><GuideComponent onMessageSend={(msg: string) => {sendMessage(msg)} } /></div>):null)
            }
            {conversations.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 w-full">
                    <GuideComponent onMessageSend={(msg: string) => {sendMessage(msg)} } />
                </div>
            )}
            {!activeConversationId && conversations.length > 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 w-full">
                    <GuideComponent onMessageSend={(msg: string) => {sendMessage(msg)} } />
                </div>)
            }
            {conversations.filter(c => c.id === activeConversationId).map(conv => (
                <Virtuoso
                    style={{ flex: 1, margin: "unset", padding: "unset" }}
                    totalCount={conv.messages.length}
                    key={conv.id}
                    className="flex-1 overflow-y-auto w-full"
                    followOutput={status === "streaming"}
                    components={{
                        Footer: () =>
                            <div className={`flex-1 transition-all ${status === "streaming"? "min-h-10" : "h-0"}`}>
                                {status === "streaming" ? (
                                    <div className="p-2">
                                        <AssistantChatBubble currentResponse={currentResponse} status={status} />
                                    </div>
                                ) : null}
                            <div ref={messagesEndRef} />
                            </div>
                    }}
                    itemContent={i => {
                        const msg = conv.messages[i]
                        return(
                            <div className="flex flex-col">
                                <div className={`flex items-center ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    {msg.role === "user"
                                    ? <UserChatBubble key={msg.id} message={msg.content} showEdit={status === "idle" && i === conv.messages.length -2 } onEditSave={(newMessage) => sendMessage(newMessage)}/>
                                    : <AssistantChatBubble message={msg.content} error={msg.status === "error"} usage={msg.usage} metrics={msg.metrics} status={status} settings={settings} />}
                                </div>
                            </div>
                        )
                    }}
                />
            ))}
            <div className="sticky bottom-0 p-4 w-full">
                {status === "streaming" && (currentResponse.length === 0 ? <div className="text-gray-500 flex gap-2 items-center"><Spinner />Thinking...</div> : <div className="text-gray-500 flex gap-2 items-center"><Spinner />Answering...</div>)}
                <div className=" w-full rounded-xl bg-zinc-100 dark:bg-zinc-950">
                    <ChatInput status={status} sendMessage={sendMessage} stopStreaming={stopStreaming} />
                </div>
            </div>
            <OfflineComponent />
        </div>
    );
}

export default ChatContainer;