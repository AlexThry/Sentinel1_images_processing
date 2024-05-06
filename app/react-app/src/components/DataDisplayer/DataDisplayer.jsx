import TextareaAutosize from 'react-textarea-autosize';


function DataDisplayer({data, dataName, inputName}) {

    let res;

    if (typeof data === 'string') {

        res = (
            <>
                <div className={"my-4 relative"}>
                    <span className={"text-sm absolute -top-2.5 left-3 z-10 px-1 bg-white rounded"}>{dataName}</span>
                    <TextareaAutosize disabled className={"textarea text-sm w-full h-fit border-solid border-gray-400 border-2 bg-white resize-none text-center"} value={data}/>
                </div>
            </>
        )
    }
    return res;
}

export default DataDisplayer;