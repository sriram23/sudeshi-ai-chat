"use client";
import { useChatStore } from "@/store/chatStore";
import { useChat } from "../hooks/useChat";
import { useState } from "react";
import ChatInput from "./ChatInput";
import { RotateCcw } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

const ChatContainer = () => {
    const { sendMessage, stopStreaming } = useChat();
    const { conversations, activeConversationId,  currentResponse, status, settings, setSettings } = useChatStore();
    const [input, setInput] = useState("");
    return (
        <div className="flex flex-col min-h-screen h-full w-full m-0 p-4 flex-1">
            <div className="flex items-top">
                <SidebarTrigger className="mb-4" size="lg"/>
                <h1 className="text-3xl font-bold ml-4">Sudeshi</h1>
            </div>
            {conversations.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 w-full">
                    <p className="mb-4">No conversations yet. Start by sending a message!</p>
                </div>
            )}
            {conversations.filter(c => c.id === activeConversationId).map(conv => (
                <div key={conv.id} className="flex-1 overflow-y-auto p-2 w-full">
                    {conv.messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            {msg.role === "user" && status === "idle" && (
                                <button onClick={() => { sendMessage(msg.content); setInput(""); }}>
                                    <RotateCcw size={16} />
                                </button>
                            )}
                            <div className={`p-2 m-1 rounded-lg ${msg.role === "user" ? "bg-zinc-300 self-end" : "self-start"}`}>
                                {msg.content}
                            </div>
                        </div>
                        
                    ))}
                    {currentResponse && (
                        <div className="p-2 my-1 rounded text-black self-start">
                            {currentResponse}
                        </div>
                    )}
                </div>
            ))}
            <div className="sticky bottom-0 p-4 w-full bg-white">
                <div className=" w-full">
                    <ChatInput input={input} setInput={setInput} settings={settings} setSettings={setSettings} status={status} sendMessage={sendMessage} stopStreaming={stopStreaming} />
                </div>
            </div>
        </div>
    );
}

export default ChatContainer;