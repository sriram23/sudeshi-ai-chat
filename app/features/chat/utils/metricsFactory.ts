export const createMetricVisual = (firstChunkPercent: number, streamingPercent:number) => {
    return [
        {percentage: firstChunkPercent, label: firstChunkPercent.toFixed(0)+"%", color: 'slate'},
        {percentage: streamingPercent, label: streamingPercent.toFixed(0)+"%", color: 'cyan'}
    ]
}