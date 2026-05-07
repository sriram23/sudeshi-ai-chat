import MetricsBar from "./MetricsBar"
import { createMetricVisual } from "../utils/metricsFactory"

const MetricsCard = ({totalToken, promptToken, completionToken, totalTime=0, tokenSpeed=0, firstChunk=0, streaming=0}:{totalToken: number, promptToken: number, completionToken: number, totalTime: number | undefined, tokenSpeed: number | undefined, firstChunk: number | undefined, streaming: number | undefined}) => {
    const firstChunkPercent = (firstChunk/totalTime) * 100
    const streamingPercent = (streaming/totalTime) * 100
    const getInsight = (firstChunkPercent:number, streamingPercent:number) => {
        if(firstChunkPercent > 70) return "Most latency occurred before streaming began."
        else if(streamingPercent > 70) return "Most response time was spent generating tokens."
        else return "Latency is evenly split between initialization and generation."
    }

    const getBadge = (firstChunk:number, streaming:number, firstChunkPercent:number, streamingPercent:number) => {
        if(firstChunk < 800) return <div className="bg-green-200 px-2 rounded-2xl text-xs text-green-500">Fast Startup</div>
        if(firstChunk > 3000 && firstChunkPercent > 60) return <div className="bg-yellow-200 px-2 rounded-2xl text-xs text-yellow-500">Delayed Startup</div>
        if(streaming > 10000 || streamingPercent > 75) return <div className="bg-blue-200 px-2 rounded-2xl text-xs text-blue-500">Generation Dominated</div>
        if(tokenSpeed > 120) return <div className="bg-emerald-200 px-2 rounded-2xl text-xs text-emerald-500">High Throughput</div>
    }
    return (
        <div className="rounded-lg shadow-md border border-zinc-200 p-2 text-zinc-600">
            <div className="flex items-center justify-between"><div className="font-bold">Usage & Metrics</div>{getBadge(firstChunk, streaming, firstChunkPercent, streamingPercent)}</div>
            <div className="flex flex-col my-2">
                <span className="font-bold">Tokens</span>
                <span className="text-sm text-black">{totalToken} Total</span>
                <div className="flex gap-2 items-center">
                    <div className="text-sm "><span className="text-black">{promptToken}</span> prompt</div>
                    •
                    <div className="text-sm "><span className="text-black">{completionToken}</span> completion</div>
                </div>
            </div>
            <div className="flex flex-col my-2">
                <span className="font-bold">Performance</span>
                <div className="text-sm">Total Time: <span className="text-black">{totalTime.toFixed(0)} ms</span></div>
                <div className="text-sm">Token Speed: <span className="text-black">{tokenSpeed.toFixed(0)} tok/s</span></div>
            </div>
            <div className="flex flex-col my-2">
                <span className="font-bold">Response Timeline</span>
                <div className="text-slate-500 text-xs">{getInsight(firstChunkPercent, streamingPercent)}</div>
                <MetricsBar metrics={createMetricVisual(firstChunkPercent, streamingPercent)} />
                <div className="flex gap-2 items-center text-sm"><div className="flex items-center gap-2 min-w-36"><div className="w-2 h-2 bg-slate-500"/> Time to First Token:</div> <span className="text-black min-w-20">{firstChunk.toFixed(0)} ms</span> ({firstChunkPercent.toFixed(0)}%)</div>
                <div className="flex gap-2 items-center text-sm"><div className="flex items-center gap-2 min-w-36"><div className="w-2 h-2 bg-cyan-500"/> Streaming:</div> <span className="text-black min-w-20">{streaming.toFixed(0)} ms</span> ({streamingPercent.toFixed(0)}%)</div>
            </div>
        </div>
    )
}

export default MetricsCard