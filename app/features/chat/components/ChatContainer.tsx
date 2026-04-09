"use client";
import { useChatStore } from "@/store/chatStore";
import { useChat } from "../hooks/useChat";
import { useState, useRef, useEffect } from "react";
import ChatInput from "./ChatInput";
import { SidebarTrigger } from "@/components/ui/sidebar";
import GuideComponent from "./GuideComponent";
import UserChatBubble from "./UserChatBubble";
import AssistantChatBubble from "./AssistantChatBubble";

const ChatContainer = () => {
    const { sendMessage, stopStreaming } = useChat();
    const { conversations, activeConversationId,  currentResponse, status, settings, setSettings } = useChatStore();
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [currentResponse, status]);
    return (
        <div className="flex flex-col min-h-screen h-full w-full m-0 p-4 flex-1">
            <div className="flex items-top sticky top-0 z-10 bg-gray-100 dark:bg-zinc-950 mb-4">
                <SidebarTrigger className="mb-4" size="lg"/>
                <h1 className="text-3xl font-bold ml-4">Sudeshi</h1>
            </div>
            {
                conversations.filter(c => c.id === activeConversationId).map(conv => !conv.messages.length ? (<div key={conv.id} className="flex-1 flex flex-col items-center justify-center text-gray-500 w-full"><GuideComponent onMessageSend={(msg: string) => {sendMessage(msg)} } /></div>):null)
            }
            {conversations.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 w-full">
                    <GuideComponent onMessageSend={(msg: string) => {sendMessage(msg)} } />
                </div>
            )}
            {conversations.filter(c => c.id === activeConversationId).map(conv => (
                <div key={conv.id} className="flex-1 overflow-y-auto p-2 w-full">
                    {conv.messages.map((msg, ind) => (
                        <div key={msg.id} className={`flex items-center ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            {msg.role === "user" && (
                                // Only show edit button for the last user message and when the status is idle (not streaming)
                                <UserChatBubble message={msg.content} showEdit={status === "idle" && ind === conv.messages.length - 2} onEditSave={(newMessage) => sendMessage(newMessage)} />
                            )}
                            {msg.role === "assistant" && (
                                <AssistantChatBubble message={msg.content} error={msg.status === "error"} usage={msg.usage} status={status} />
                            )}
                        </div>
                    ))}
                    {status === "streaming" && (
                        <AssistantChatBubble currentResponse={currentResponse} status={status} />
                    )}
                    <div ref={messagesEndRef} />
                </div>
            ))}
            <div className="sticky bottom-0 p-4 w-full bg-gray-100 dark:bg-zinc-950">
                <div className=" w-full">
                    <ChatInput input={input} setInput={setInput} settings={settings} setSettings={setSettings} status={status} sendMessage={sendMessage} stopStreaming={stopStreaming} />
                </div>
            </div>
        </div>
    );
}

export default ChatContainer;