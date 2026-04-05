import { useChatStore } from "@/store/chatStore"
import { createMessage } from "@/app/features/chat/utils/messageFactory";

export const useChat = () => {
    const {
        addMessage,
        appendToResponse,
        finalizeResponse,
        updateGlobalStatus,
        status,
        setAbortController
    } = useChatStore();

    const sendMessage = async (input: string) => {
        // Abort controller
        const controller = new AbortController();
        setAbortController(controller);

        if(!input.trim()) return;
        if(status === "streaming") return; // Prevent sending new messages while streaming

        const userMessage = createMessage("user", input, "completed");
        addMessage(userMessage);

        updateGlobalStatus("streaming");

        try {
            const fakeResponse = `This is a simulated response from the assistant. In a real implementation, this would come from the backend.5 paragraphs of Lorem Ipsum
Quisquam veritatis rerum labore quia. Quos non enim omnis enim. Ea enim neque velit dignissimos ipsa. Possimus libero et optio et quibusdam.

Voluptas quas ut rem voluptatem est accusantium. Ipsa doloremque sunt vel incidunt voluptatem. Enim fugit tempore porro voluptatum deserunt. Non sit sit dignissimos repellendus. Magnam architecto expedita ullam numquam culpa. Animi consequatur voluptatum est.

Alias similique quas mollitia at qui aut. Eos provident aut deleniti ea totam doloremque corporis. Nihil nemo et eos adipisci repellat similique reiciendis. Tempora ducimus odit minus ut natus est eaque. Facilis suscipit necessitatibus laborum qui quia earum.

Saepe ut et veritatis. Consequatur ea ea odio ipsum ratione. Perspiciatis et magni ipsa. Ut animi eum rerum quia voluptatem.

Neque laborum eligendi totam. Dolor corrupti quidem veniam optio laudantium nostrum temporibus. Blanditiis corporis natus dolorem nostrum exercitationem consequatur. Aut dolorem eum quos et et et quaerat. Aut eaque aut nostrum hic ducimus rerum adipisci.`;

            for (let i = 0; i < fakeResponse.length; i++) {
                if(controller.signal.aborted) {
                    console.log("Streaming aborted");
                    break;
                }
                await new Promise((resolve) => setTimeout(resolve, 20)); // Simulate streaming delay
                appendToResponse(fakeResponse[i]);
            }

            setTimeout(() => finalizeResponse(), 1000); // Simulate delay before finalizing response
            setAbortController(undefined); // Clear abort controller after response is finalized
        } catch (error) {
            console.error("Error sending message:", error);
            updateGlobalStatus("error");
        }
    };
    const stopStreaming = () => {
        const { controls } = useChatStore.getState();
        controls.abortController?.abort();
    }
    return { sendMessage, stopStreaming };

}