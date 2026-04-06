"use client";
import { useChatStore } from "@/store/chatStore";
import { useChat } from "../hooks/useChat";
import { useState } from "react";
import ChatInput from "./ChatInput";
import { RotateCcw } from "lucide-react";

const ChatContainer = () => {
    const { sendMessage, stopStreaming } = useChat();
    const { conversations, activeConversationId,  currentResponse, status, settings, setSettings } = useChatStore();
    const [input, setInput] = useState("");
    return (
        <div className="flex flex-col h-full w-full m-0 p-4">
            {conversations.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                    <p className="mb-4">No conversations yet. Start by sending a message!</p>
                </div>
            )}
            {conversations.filter(c => c.id === activeConversationId).map(conv => (
                <div key={conv.id} className="flex-1 overflow-y-auto p-2">
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
            <div className="fixed bottom-0 w-3/4 p-4 bg-white">
                <ChatInput input={input} setInput={setInput} settings={settings} setSettings={setSettings} status={status} sendMessage={sendMessage} stopStreaming={stopStreaming} />
            </div>
        </div>
    );
}

export default ChatContainer;