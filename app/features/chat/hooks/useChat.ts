import { useChatStore } from "@/store/chatStore"
import { createMessage } from "@/app/features/chat/utils/messageFactory";
import { streamChat } from "../services/sarvamClient";
import { setGlobal } from "next/dist/trace";

export const useChat = () => {
    const {
        addMessage,
        appendToResponse,
        finalizeResponse,
        updateGlobalStatus,
        status,
        setAbortController,
    } = useChatStore();

    const sendMessage = async (input: string, model: string = "sarvam-30b") => {
        // Abort controller
        const controller = new AbortController();
        setAbortController(controller);

        if(!input.trim()) return;
        if(status === "streaming") return; // Prevent sending new messages while streaming

        const userMessage = createMessage("user", input, "completed");
        addMessage(userMessage);

        updateGlobalStatus("streaming");

        try {
            const { messages: latestMessages } = useChatStore.getState();

            const history =  latestMessages.map(msg => ({ role: msg.role, content: msg.content }));
            const truncatedHistory = history.slice(-19);
            await streamChat([...truncatedHistory], model, (chunk) => { appendToResponse(chunk) }, controller.signal);
            finalizeResponse();
        } catch (error) {
            if(controller.signal.aborted) {
                console.log("Streaming aborted by user.");
                finalizeResponse();
            } else {
                console.error("Error during streaming:", error);
                updateGlobalStatus("error");
            }
        } finally {
            setAbortController(undefined);
        }
    };
    const stopStreaming = () => {
        const { controls } = useChatStore.getState();
        controls.abortController?.abort();
    }
    return { sendMessage, stopStreaming };

}