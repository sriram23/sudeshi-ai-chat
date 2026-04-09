"use client";
import { useChatStore } from "@/store/chatStore";
import { useChat } from "../hooks/useChat";
import { useState, useRef, useEffect } from "react";
import ChatInput from "./ChatInput";
import { CircleAlert, RotateCcw } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MarkdownRenderer } from "./MarkdownRender";
import GuideComponent from "./GuideComponent";

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
            <div className="flex items-top sticky top-0 z-10 bg-white dark:bg-zinc-950 mb-4">
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
                    {conv.messages.map((msg) => (
                        <div key={msg.id} className={`flex items-center ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            {msg.role === "user" && status === "idle" && (
                                <button onClick={() => { sendMessage(msg.content); setInput(""); }}>
                                    <RotateCcw size={16} />
                                </button>
                            )}
                            {msg.role === "user" && status === "idle" && msg.status === "error" && <CircleAlert color="red" />}
                            <div className={`p-2 m-1 rounded-lg ${msg.role === "user" ? "bg-zinc-300 dark:bg-zinc-800 self-end" : "self-start"}`}>
                                <MarkdownRenderer content={msg.content} />
                                {msg.role === "assistant" && msg.usage && (
                                    <div className="text-xs text-gray-500 mt-1">
                                        Tokens usage: {msg.usage.total_tokens} (Prompt: {msg.usage.prompt_tokens}, Completion: {msg.usage.completion_tokens})
                                    </div>
                                )}
                            </div>
                            {msg.role !== "user" && status === "idle" && msg.status === "error" && <CircleAlert color="red" />}
                        </div>
                    ))}
                    {status === "streaming" && (
                        <div className="p-2 my-1 rounded text-black font-extralight italic self-start">
                            <MarkdownRenderer content={currentResponse.length ?"Responding...":"Thinking..."} />
                        </div>
                    )}
                    {currentResponse && (
                        <div className="p-2 my-1 rounded text-black self-start">
                            <MarkdownRenderer content={currentResponse} />
                        </div>
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