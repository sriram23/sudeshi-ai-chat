import { cn } from "@/lib/utils"
import { Circle } from "lucide-react"

const CustomSpinner = ({className, ...props}:{className: string, props?: unknown}) => {
    return (
        <div>
            <Circle
                role="status"
                aria-label="Loading"
                className={cn("size-4 bg-zinc-950 rounded-full animate-ping m-0 p-0", className)}
                {...props}
            />
        </div>
    )
}
export default CustomSpinner