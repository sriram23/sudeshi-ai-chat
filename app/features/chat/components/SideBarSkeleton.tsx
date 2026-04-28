const SideBarSkeleton = () => {
    return (
        <div className="p-4 space-y-4 animate-pulse">
            <div className="h-16 w-full bg-zinc-300 rounded" />
            <div className="h-10 w-full bg-zinc-300 rounded" />
            <div className="space-y-2">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="h-8 w-full bg-zinc-300 rounded" />
                ))}
            </div>
        </div>
    )
}

export default SideBarSkeleton