import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { WifiOff } from "lucide-react"
import { useState, useEffect } from "react"

const OfflineComponent = () => {
    const [isOnline, setIsOnline] = useState(true)
    useEffect(() => {
        if(navigator.onLine) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsOnline(true)
        }

        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        window.addEventListener("offline", handleOffline)
        window.addEventListener("online", handleOnline)

        return () => {
            window.removeEventListener("offline", handleOffline)
            window.removeEventListener("online", handleOnline)
        }
    }, [])
    return (
        <Dialog open={!isOnline} onOpenChange={(open) => {
            if(!isOnline && open === false) return
        }}>
            <DialogContent showCloseButton={false} className="bg-zinc-100 dark:bg-zinc-950">
                <DialogHeader>
                    <DialogTitle className="flex gap-2 items-center"><WifiOff color="red"/>You&apos;re Offline!</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    You are offline. Please check your network and try again later.
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}

export default OfflineComponent