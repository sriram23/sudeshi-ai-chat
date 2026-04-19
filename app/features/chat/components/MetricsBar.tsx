const MetricsBar = ({metrics}: {metrics: { percentage: number, label: string, color: string }[] | undefined}) => {
    return (
        <div className="flex justify-between items-center gap-2">
            <div className="flex w-full my-1 rounded-full overflow-x-hidden ring-1 ring-white/10">
                {metrics?.map(m => {
                    return (
                        <span key={m.label} style={{width: Math.max(m.percentage, 6)+"%"}} className={`bg-${m.color}-500 px-2 text-center`}>{m.percentage > 12 ? m.label : ""}</span>
                    )
                })}
            </div>
        </div>
    )
}

export default MetricsBar