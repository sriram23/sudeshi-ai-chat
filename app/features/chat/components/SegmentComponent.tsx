const SegmentComponent = ({left, right}: {left: string, right: string}) => {
    return(
        <div className="w-full h-4 bg-gray-200 relative border">
            <div
                className="absolute top-0 left-0 h-full bg-yellow-400"
                style={{ width: left+"%" }}
            >{left}%</div>
            <div
                className="absolute top-0 h-full bg-green-500"
                style={{ left: left+"%", width: right+"%" }}
            >{right}%</div>
            <div
                className="absolute top-0 h-full w-[2px] bg-black"
                style={{ left: left+"%" }}
            />
        </div>
    )
}

export default SegmentComponent