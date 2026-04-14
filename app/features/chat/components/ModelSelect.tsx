import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { memo } from "react";
const ModelSelect = memo(({settings, setSettings}:{settings: { model: "sarvam-30b" | "sarvam-105b" }; setSettings: (newSettings: { model: "sarvam-30b" | "sarvam-105b" }) => void;}) => {
    return(
        <DropdownMenu>
            <DropdownMenuTrigger render={<button className="border rounded-2xl p-2" />}>
                <span className="flex justify-between items-center">{settings?.model === "sarvam-30b" ? "Sarvam 30B": settings?.model === "sarvam-105b" ? "Sarvam 150B": settings?.model} <ChevronDown/></span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white dark:bg-zinc-950">
                <DropdownMenuGroup>
                    <DropdownMenuItem className="hover:bg-gray-200 dark:hover:bg-zinc-800" onClick={() => setSettings({model: "sarvam-30b"})}>Sarvam 30B</DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-200 dark:hover:bg-zinc-800" onClick={() => setSettings({model: "sarvam-105b"})}>Sarvam 150B</DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
})

ModelSelect.displayName="ModelSelect"

export default ModelSelect