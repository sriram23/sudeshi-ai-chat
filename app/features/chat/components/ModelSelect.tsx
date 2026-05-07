import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useChatStore } from "@/store/chatStore";
import { ChevronDown } from "lucide-react"
import { memo, useEffect } from "react";
import { fetchAvailableModels } from "../services/sarvamClient";
const ModelSelect = memo(({settings, setSettings}:{settings: { model: string, baseUrl?: string }; setSettings: (newSettings: { model: string, baseUrl?: string }) => void;}) => {
    const {availableModels, setModels,} = useChatStore();
    const setError = useChatStore(s => s.setError)

    const baseUrl = settings.baseUrl
    useEffect(() => {
        if(!baseUrl) return
        const fetchModels = async () => {
            try {
                const res = await fetchAvailableModels(baseUrl)
                if(res?.error === null) {
                    const models = res.models
                    const modelArray = models.map((model: { name?: string }) => model?.name)

                    if(modelArray.length) {
                        setModels(modelArray)
                    }
                } else {
                    setError(res?.error ?? "Unknown error")
                }
            } catch(error) {
                setError(error instanceof Error ? error.message : "Unknown error")
            }
        }
        // Fetch available models from the server
        fetchModels();
    }, [baseUrl, setModels, setError]);

    return(
        <DropdownMenu>
            <DropdownMenuTrigger render={<button className="border rounded-xl p-2" />}>
                <span className="flex justify-between items-center">{settings?.model === "sarvam-30b" ? "Sarvam 30B": settings?.model === "sarvam-105b" ? "Sarvam 150B": settings?.model} <ChevronDown/></span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white dark:bg-zinc-950">
                <DropdownMenuGroup>
                    {availableModels?.map((model) => (
                        <DropdownMenuItem key={model} className="hover:bg-gray-200 dark:hover:bg-zinc-800" onClick={() => setSettings({model: model})}>{model === "sarvam-30b" ? "Sarvam 30B": model === "sarvam-105b" ? "Sarvam 105B": model}</DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
})

ModelSelect.displayName="ModelSelect"

export default ModelSelect
