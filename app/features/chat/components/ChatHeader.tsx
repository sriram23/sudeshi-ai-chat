import { SidebarTrigger } from "@/components/ui/sidebar"
import ModelSelect from "./ModelSelect"
import { useChatStore } from "@/store/chatStore"

const ChatHeader = () => {
    const { settings, setSettings } = useChatStore()
    return (
        <div className="flex gap-2 items-center">
            <SidebarTrigger className="mb-4" size="lg"/>
            <h1 className="text-3xl font-bold ml-4">Sudeshi</h1>
            <ModelSelect settings={settings} setSettings={setSettings} />
            <div>
                <button onClick={() => setSettings({
                    showMetrics: !settings.showMetrics,
                    model: settings.model
                })}>Metrics {settings.showMetrics?(<span className="text-green-500">On</span>):(<span className="text-red-500">Off</span>)}</button>
            </div>
        </div>
    )
}

export default ChatHeader