import { SidebarTrigger } from "@/components/ui/sidebar"
import ModelSelect from "./ModelSelect"
import { useChatStore } from "@/store/chatStore"
import { BadgeAlert, BadgeCheck } from "lucide-react"

const ChatHeader = () => {
    const { settings, setSettings, error } = useChatStore()
    return (
        <div className="flex px-2 gap-2 items-center justify-between w-full">
            <div className="flex">
                <SidebarTrigger className="mb-4" size="lg"/>
                <h1 className="text-3xl font-bold ml-4">Sudeshi</h1>
            </div>
            <div className="flex gap-2 items-center">
                {error && error === "Failed to fetch available models"
                ? <span className="text-xs font-bold flex items-center gap-1 text-white bg-red-700 p-2 rounded-2xl"><BadgeAlert className="font-bold" size={14} />Some issue fecthing Ollama Models</span>
                : settings.baseUrl && <span className="text-xs font-bold flex items-center gap-1 text-white bg-green-700 p-2 rounded-2xl"><BadgeCheck className="font-bold" size={14} /> Fetched the Ollama Models</span>}
                <ModelSelect settings={settings} setSettings={setSettings} />
            </div>
        </div>
    )
}

export default ChatHeader