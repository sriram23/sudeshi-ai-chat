import { useChatStore } from "@/store/chatStore";
import { useState } from "react";

const SettingsComponent = () => {
    // const [enabled, setEnabled] = useState(false)
    const { settings, setSettings } = useChatStore()
    const [baseUrl, setBaseUrl] = useState(settings.baseUrl)
    const [inputDisabled, setInputDisabled] = useState(true)

    const handleSaveClick = () => {
        setSettings({
            ...settings,
            baseUrl
        })
        setInputDisabled(true)
    }
    return (
        <div className="flex flex-col">
            <div className="flex flex-col gap-2">
                <input disabled={inputDisabled} className="border border-zinc-950 my-2 p-2 rounded-lg disabled:bg-zinc-300" type="url" placeholder="Enter the model url" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)}/>
                <select disabled={inputDisabled} className="border border-zinc-950 rounded-lg p-2 my-2 disabled:bg-zinc-300">
                    <option value="ollama">Ollama</option>
                    {/* Todo: Add option for Hugging face */}
                    {/* <option value="hugging-face">Hugging Face</option> */}
                </select>
                {inputDisabled && <button className="bg-zinc-950 rounded-lg text-white my-2 p-2" onClick={()=> setInputDisabled(false)}>Edit</button>}
                {!inputDisabled && <button className="bg-zinc-950 rounded-lg text-white my-2 p-2" onClick={handleSaveClick}>Save</button>}
            </div>
        </div>
    );
}

export default SettingsComponent;