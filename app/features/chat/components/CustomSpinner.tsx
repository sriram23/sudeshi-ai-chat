import { cn } from "@/lib/utils"
import { Cog } from "lucide-react"

const CustomSpinner = ({className, ...props}:{className: string, props: unknown}) => {
    return (
        <Cog
            role="status"
            aria-label="Loading"
            className={cn("size-4 animate-spin text-gray-700", className)}
            {...props}
        />
    )
}
export default CustomSpinner