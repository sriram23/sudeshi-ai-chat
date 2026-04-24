import { SidebarTrigger } from "@/components/ui/sidebar"
import ModelSelect from "./ModelSelect"
import { useChatStore } from "@/store/chatStore"

const ChatHeader = () => {
    const { settings, setSettings } = useChatStore()
    return (
        <div className="flex px-2 gap-2 items-center justify-between w-full">
            <div className="flex">
                <SidebarTrigger className="mb-4" size="lg"/>
                <h1 className="text-3xl font-bold ml-4">Sudeshi</h1>
            </div>
            <div className="flex gap-2 items-center">
                <ModelSelect settings={settings} setSettings={setSettings} />
            </div>
        </div>
    )
}

export default ChatHeader