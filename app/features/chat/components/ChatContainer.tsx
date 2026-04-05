"use client";
import { useChatStore } from "@/store/chatStore";
import { useChat } from "../hooks/useChat";
import { useState } from "react";

const ChatContainer = () => {
    const { sendMessage, stopStreaming } = useChat();
    const { messages, currentResponse, status } = useChatStore();
    const [input, setInput] = useState("");
    return (
        <div className="flex flex-col h-full">
            <p>Status: {status}</p>
            <div>
                {messages.map((msg) => (
                    <div key={msg.id} className={`p-2 my-1 rounded ${msg.role === "user" ? " self-end" : "bg-gray-300 text-black self-start"}`}>
                        {msg.content}
                    </div>
                ))}

                {currentResponse && (
                    <div className="p-2 my-1 rounded bg-gray-300 text-black self-start">
                        {currentResponse}
                    </div>
                )}
            </div>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} className="mt-auto p-2 border rounded" placeholder="Type your message..."/>
            <button disabled={status === "streaming"} onClick={() => { sendMessage(input); setInput(""); }} className="mt-2 p-2 rounded">Send</button>
            {status === "streaming" && (
                <button onClick={stopStreaming} className="mt-2 p-2 rounded bg-red-500 text-white">
                    Stop Streaming
                </button>
            )}
        </div>
    );
}

export default ChatContainer;