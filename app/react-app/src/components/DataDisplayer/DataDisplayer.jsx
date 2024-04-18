function DataDisplayer({data, dataName}) {
    let res;
    if (typeof data === 'string') {
        res = (
            <>
                <div className={"my-4 relative"}>
                    <span className={"text-sm absolute -top-2.5 left-3 z-10 px-1 bg-white rounded"}>{dataName}</span>
                    <p className={"text-sm p-4 rounded-lg border-solid border border-gray-300 text-red-500"}>{data}</p>
                </div>
            </>
        )
    }
    return res;
}

export default DataDisplayer;