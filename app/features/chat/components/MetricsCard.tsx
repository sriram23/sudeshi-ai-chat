import MetricsBar from "./MetricsBar"
import { createMetricVisual } from "../utils/metricsFactory"
import { useState } from "react"

const MetricsCard = ({totalToken, promptToken, completionToken, totalCost, promptTokenCost, completionTokenCost, totalTime=0, tokenSpeed=0, firstChunk=0, streaming=0}:{totalToken: number, promptToken: number, completionToken: number, totalCost: number, promptTokenCost: number, completionTokenCost: number, totalTime: number | undefined, tokenSpeed: number | undefined, firstChunk: number | undefined, streaming: number | undefined}) => {
    const [showCost, setShowCost] = useState(false)
    const [showUsage, setShowUsage] = useState(false)
    const [showPerformance, setShowPerformance] = useState(false)
    const firstChunkPercent = (firstChunk/totalTime) * 100
    const streamingPercent = (streaming/totalTime) * 100

    const getBadge = (firstChunk:number, streaming:number, firstChunkPercent:number, streamingPercent:number) => {
        if(firstChunk < 800) return <div className="bg-green-200 px-2 rounded-2xl text-xs text-green-500">Fast Startup</div>
        if(firstChunk > 3000 && firstChunkPercent > 60) return <div className="bg-yellow-200 px-2 rounded-2xl text-xs text-yellow-500">Delayed Startup</div>
        if(streaming > 10000 || streamingPercent > 75) return <div className="bg-blue-200 px-2 rounded-2xl text-xs text-blue-500">Generation Dominated</div>
        if(tokenSpeed > 120) return <div className="bg-emerald-200 px-2 rounded-2xl text-xs text-emerald-500">High Throughput</div>
    }
    const shouldShowCostSection = totalCost !== -1 && promptTokenCost !== -1 && completionTokenCost !== -1
    return (
        <div className="rounded-lg shadow-md border border-zinc-200 p-2 text-zinc-600">
            <div className="flex items-center justify-between"><div className="font-bold">Usage & Metrics</div>{getBadge(firstChunk, streaming, firstChunkPercent, streamingPercent)}</div>
            <div className="flex flex-col my-2">
                <div className="flex items-center justify-between">
                    <span className="font-bold">Tokens {!showUsage && <span className="text-sm font-normal"> {totalToken}({promptToken} + {completionToken})</span> }</span>
                    <button className="underline text-sm" onClick={() => setShowUsage(!showUsage)}>{showUsage ? "Hide details" : "Show details"}</button>
                </div>
                {showUsage && <>
                    <span className="text-sm text-black dark:text-zinc-100">{totalToken} Total</span>
                    <div className="flex gap-2 items-center">
                        <div className="text-sm "><span className="text-black dark:text-zinc-100">{promptToken}</span> prompt</div>
                        •
                        <div className="text-sm "><span className="text-black dark:text-zinc-100">{completionToken}</span> completion</div>
                    </div>
                </>}
            </div>
            {shouldShowCostSection && (
                <div className="flex flex-col my-2">
                    <div className="flex items-center justify-between">
                        <span className="font-bold">Estimated Cost {!showCost && <span className="text-sm font-normal">{totalCost > 0.01 ? '₹' + totalCost.toFixed(2) : '< ₹0.01'}   ( {promptTokenCost.toFixed(2)} + {completionTokenCost.toFixed(2)} )</span>}</span>
                        <button className="underline text-sm" onClick={() => setShowCost(!showCost)}>{showCost ? "Hide details" : "Show details"}</button>
                    </div>
                    {showCost &&
                    <>
                        <div className="text-sm">Total Cost: <span className="text-black dark:text-zinc-100">{totalCost > 0.01 ? '₹' + totalCost.toFixed(2) : '< ₹0.01'}</span></div>
                        <div className="text-sm">Input Cost: <span className="text-black dark:text-zinc-100">{promptTokenCost > 0.01 ? '₹' + promptTokenCost.toFixed(2) : '< ₹0.01'}</span></div>
                        <div className="text-sm">Output Cost: <span className="text-black dark:text-zinc-100">{completionTokenCost > 0.01 ? '₹' + completionTokenCost.toFixed(2) : '< ₹0.01'}</span></div>
                    </>}
                </div>
            )}
            <div className="flex flex-col my-2">
                <div className="flex items-center justify-between">
                    <span className="font-bold">Performance {!showPerformance && <span className="text-sm font-normal"> {totalTime.toFixed(0)} ms ({tokenSpeed.toFixed(0)} tok/s)</span> }</span>
                    <button className="underline text-sm" onClick={() => setShowPerformance(!showPerformance)}>{showPerformance ? "Hide details" : "Show details"}</button>
                </div>
                {showPerformance && <>
                    <div className="text-sm">Total Time: <span className="text-black dark:text-zinc-100">{totalTime.toFixed(0)} ms</span></div>
                    <div className="text-sm">Token Speed: <span className="text-black dark:text-zinc-100">{tokenSpeed.toFixed(0)} tok/s</span></div>
                </>}
            </div>
            {showPerformance && <div className="flex flex-col my-2">
                <span className="font-bold">Response Timeline</span>
                <MetricsBar metrics={createMetricVisual(firstChunkPercent, streamingPercent)} />
                <div className="flex gap-2 items-center text-sm"><div className="flex items-center gap-2 min-w-36"><div className="w-2 h-2 bg-slate-500"/> Time to First Token:</div> <span className="text-black dark:text-zinc-100  min-w-20">{firstChunk.toFixed(0)} ms</span> ({firstChunkPercent.toFixed(1)}%)</div>
                <div className="flex gap-2 items-center text-sm"><div className="flex items-center gap-2 min-w-36"><div className="w-2 h-2 bg-cyan-500"/> Streaming:</div> <span className="text-black dark:text-zinc-100 min-w-20">{streaming.toFixed(0)} ms</span> ({streamingPercent.toFixed(1)}%)</div>
            </div>}
        </div>
    )
}

export default MetricsCard