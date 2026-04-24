import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
    
const CustomDialog = ({title, children, shouldOpen, onDialogOpenChange}: { title: string; children: React.ReactNode, shouldOpen: boolean, onDialogOpenChange: (open:boolean) => void }) => {
    return (
        <Dialog open={shouldOpen} onOpenChange={(open) => {
            onDialogOpenChange(open)
            if(!shouldOpen && open === true) return
        }}>
            <DialogContent className="bg-white dark:bg-zinc-900">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
}

export default CustomDialog