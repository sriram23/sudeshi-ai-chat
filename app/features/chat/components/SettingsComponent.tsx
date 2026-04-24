import { useChatStore } from "@/store/chatStore";
import { useState } from "react";

const SettingsComponent = () => {
    // const [enabled, setEnabled] = useState(false)
    const { settings, setSettings } = useChatStore()
    const [baseUrl, setBaseUrl] = useState(settings.baseUrl)
    return (
        <div className="flex flex-col">
            <div>
                <button className="w-35 bg-black hover:bg-zinc-900 text-white border border-zinc-950 p-2 my-2 rounded-lg" onClick={() => setSettings({
                    showMetrics: !settings.showMetrics,
                    model: settings.model
                })}>Metrics {settings.showMetrics?(<span className="text-green-500">On</span>):(<span className="text-red-500">Off</span>)}</button>
            </div>
            <div className="flex flex-col gap-2">
                <input className="border border-zinc-950 my-2 p-2 rounded-lg" type="url" placeholder="Enter the model url" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)}/>
                <select className="border border-zinc-950 rounded-lg p-2 my-2">
                    <option value="ollama">Ollama</option>
                    {/* Todo: Add option for Hugging face */}
                    {/* <option value="hugging-face">Hugging Face</option> */}
                </select>
                <button className="bg-zinc-950 rounded-lg text-white my-2 p-2" onClick={() => setSettings({
                    ...settings,
                    baseUrl
                })}>Save</button>
            </div>
        </div>
    );
}

export default SettingsComponent;