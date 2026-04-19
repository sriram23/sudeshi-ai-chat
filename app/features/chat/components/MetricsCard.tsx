import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import MetricsBar from "./MetricsBar"
import { createMetricVisual } from "../utils/metricsFactory"

const MetricsCard = ({totalToken, promptToken, completionToken, totalTime=0, tokenSpeed=0, firstChunk=0, streaming=0}:{totalToken: number, promptToken: number, completionToken: number, totalTime: number | undefined, tokenSpeed: number | undefined, firstChunk: number | undefined, streaming: number | undefined}) => {
    const firstChunkPercent = (firstChunk/totalTime) * 100
    const streamingPercent = (streaming/totalTime) * 100
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Usage & Metrics</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col my-4">
                    <span className="text-lg">Tokens</span>
                    <span className="font-bold">{totalToken}</span>
                    <div className="flex gap-2">
                        <div><span>Prompt:</span> <span className="font-bold">{promptToken}</span></div>
                        |
                        <div><span>Completion:</span> <span className="font-bold">{completionToken}</span></div>
                    </div>
                </div>
                <div className="flex flex-col my-4">
                    <span className="text-lg">Performance</span>
                    <div>Total Time: <span className="font-bold">{totalTime.toFixed(2)} ms</span></div>
                    <div>Token Speed: <span className="font-bold">{tokenSpeed.toFixed(2)}/s</span></div>
                </div>
                <div className="flex flex-col my-4">
                    <span className="text-lg">Response Breakdown</span>
                    <MetricsBar metrics={createMetricVisual(firstChunkPercent, streamingPercent)} />
                    <div className="flex gap-2 items-center"><div className="w-2 h-2 bg-yellow-500"/> First Chunk: <span className="font-bold">{firstChunk.toFixed(2)} ms</span> ({firstChunkPercent.toFixed(0)}%)</div>
                    <div className="flex gap-2 items-center"><div className="w-2 h-2 bg-green-500"/> Streaming: <span className="font-bold">{streaming.toFixed(2)} ms</span> ({streamingPercent.toFixed(0)}%)</div>
                </div>
            </CardContent>
        </Card>
    )
}

export default MetricsCard