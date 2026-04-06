"use client";
import { useChatStore } from "@/store/chatStore";
import { useChat } from "../hooks/useChat";
import { useState } from "react";
import ChatInput from "./ChatInput";
import { RotateCcw } from "lucide-react";

const ChatContainer = () => {
    const { sendMessage, stopStreaming } = useChat();
    const { messages, currentResponse, status, settings, setSettings } = useChatStore();
    const [input, setInput] = useState("");
    return (
        <div className="flex flex-col h-screen w-screen m-0 p-4">
            <p>Status: {status}</p>
            <div className="flex-1 overflow-y-auto p-2">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        {msg.role === "user" && status === "idle" && (
                            <button onClick={() => { sendMessage(msg.content, settings.model); setInput(""); }}>
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
            <ChatInput input={input} setInput={setInput} settings={settings} setSettings={setSettings} status={status} sendMessage={sendMessage} stopStreaming={stopStreaming} />
        </div>
    );
}

export default ChatContainer;