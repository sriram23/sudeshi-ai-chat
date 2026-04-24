import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useChatStore } from "@/store/chatStore";
import { ChevronDown } from "lucide-react"
import { memo, useCallback, useEffect } from "react";
import { fetchAvailableModels } from "../services/sarvamClient";
const ModelSelect = memo(({settings, setSettings}:{settings: { model: string, showMetrics?: boolean, baseUrl?: string }; setSettings: (newSettings: { model: string, showMetrics?: boolean, baseUrl?: string }) => void;}) => {
    const {availableModels, setModels,} = useChatStore();

    const fetchModels = useCallback(async () => {
        if(settings.baseUrl){
            try {
                const models = await fetchAvailableModels(settings?.baseUrl);
                console.log("Fetched models: ", models);
                const modelArray = models?.map((model: { name?: string }) => model?.name)
                console.log("Extracted model names: ", modelArray);
                if(modelArray?.length) setModels(modelArray);
            } catch (error) {
                console.error("Error fetching models: ", error);
            }
        }
    }, [setModels, settings]);

    useEffect(() => {
        // Fetch available models from the server
        fetchModels();
    }, [fetchModels]);

    return(
        <DropdownMenu>
            <DropdownMenuTrigger render={<button className="border rounded-xl p-2" />}>
                <span className="flex justify-between items-center">{settings?.model === "sarvam-30b" ? "Sarvam 30B": settings?.model === "sarvam-105b" ? "Sarvam 150B": settings?.model} <ChevronDown/></span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white dark:bg-zinc-950">
                <DropdownMenuGroup>
                    {availableModels?.map((model) => (
                        <DropdownMenuItem key={model} className="hover:bg-gray-200 dark:hover:bg-zinc-800" onClick={() => setSettings({model: model, showMetrics: settings.showMetrics})}>{model === "sarvam-30b" ? "Sarvam 30B": model === "sarvam-105b" ? "Sarvam 150B": model}</DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
})

ModelSelect.displayName="ModelSelect"

export default ModelSelect