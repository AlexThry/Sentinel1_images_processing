import AreaSelector from "../../components/AreaSelector/AreaSelector.jsx";
import {useContext, useEffect, useState} from "react";
import {Form, Outlet} from "react-router-dom";
import {Splitter, SplitterPanel} from "primereact/splitter";
import DownloadSelector from "../../components/DownloadSelector/DownloadSelector.jsx";
import DataDisplayer from "../../components/DataDisplayer/DataDisplayer.jsx";
import DatePicker from "react-datepicker";
import ProcessSelector from "../../components/ProcessSelector/ProcessSelector.jsx";
import {ProcessDataContext} from "../../components/ProcessDataProvider/ProcessDataProvider.jsx";


function ProcessPage() {
    const {processPolygon, setProcessPolygon, previewPolygon } = useContext(ProcessDataContext)

    const [parametersLoaded, setParametersLoaded] = useState(false)
    const [imagesNamesLoaded, setImagesNamesLoaded] = useState(false)

    const [imagePack, setImagePack] = useState("")
    const [parameters, setParameters] = useState(null)
    const [imagesNames, setImagesNames] = useState(null)
    const [response, setResponse] = useState("")
    const [inputParameters, setInputParameters] = useState({
        "folder": "",
        "DEMResamplingMethod": "BILINEAR_INTERPOLATION",
        "orbitType": "DORIS Precise VOR (ENVISAT) (Auto Download)",
        "ResamplingType": "BILINEAR_INTERPOLATION",
        "cohWinAz": "3",
        "cohWinRg": "10",
        "outputBetaBand": "false",
        "outputGammaBand": "false",
        "polygon": "",
        "subswath": "IW1",
        "windowSizeString": "3",
        "demName": "SRTM 1Sec HGT"
    })

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInputParameters(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    function validate() {
        process(inputParameters, setResponse)
        console.log(inputParameters)
    }

    useEffect(() => {
        fetchParameters(setParameters, setParametersLoaded)
        fetchDownloadedImages(setImagesNames, setImagesNamesLoaded)
    }, []);

    useEffect(() => {
        setInputParameters(prevState => ({
            ...prevState,
            ["polygon"]: processPolygon
        }))
    }, [processPolygon])

    useEffect(() => {
        setInputParameters(prevState => ({
            ...prevState,
            ["folder"]: imagePack
        }))
        console.log(inputParameters)
    }, [imagePack])

    return (
        <>
            <Outlet/>
            <Splitter className={"h-[calc(100vh-4rem)]"}>
                <SplitterPanel size={35} minSize={35} className={"overflow-y-scroll"}>
                    <div className={"w-full p-3"}>
                        <div className={"overflow-y-scroll"}>


                        {processPolygon !== "" && (
                            <div>
                                <h1 className={"text-2xl font-bold mb-4"}>Selection</h1>
                                <DataDisplayer data={processPolygon} dataName={"Selection"} onChange={handleInputChange}/>
                            </div>
                    )}


                        <ProcessSelector className={"overflow-x-auto max-h-80 overflow-y-scroll pb-4"} setImagePack={setImagePack}/>


                        <h1 className={"text-2xl font-bold mb-4"}>Choix des paramètres</h1>

                        {parametersLoaded && (
                            <div>


                                <div className={"flex flex-col relative my-4"}>
                                    <span
                                        className={"text-sm absolute -top-2.5 left-3 z-10 px-1 bg-white rounded"}>DEMResamplingMethod</span>
                                    <select name="DEMResamplingMethod" id="" defaultValue={inputParameters["DEMResamplingMethod"]} className={"select select-bordered w-full"} onChange={handleInputChange}>
                                        {
                                            parameters["DEMResamplingMethod"].map((value, index) => {
                                                return <option key={index} value={value}>{value}</option>
                                            })
                                        }
                                    </select>
                                </div>

                                <div className={"flex flex-col relative my-4"}>
                                    <span
                                        className={"text-sm absolute -top-2.5 left-3 z-10 px-1 bg-white rounded"}>ResamplingType</span>
                                    <select name="ResamplingType" id="" defaultValue={inputParameters["ResamplingType"]} className={"select select-bordered w-full"} onChange={handleInputChange}>
                                        {
                                            parameters["ResamplingType"].map((value, index) => {
                                                return <option key={index} value={value}>{value}</option>
                                            })
                                        }
                                    </select>
                                </div>

                                <div className={"flex justify-center flex-wrap"}>
                                    <div className={"flex flex-col relative m-2"}>
                                        <span
                                            className={"text-sm absolute -top-2.5 left-3 z-10 px-1 bg-white rounded"}>cohWinAz</span>
                                        <input type="number" defaultValue={inputParameters["cohWinAz"]} name="cohWinAz" id=""
                                               className={"input input-bordered w-24"} onChange={handleInputChange}/>
                                    </div>

                                    <div className={"flex flex-col relative m-2"}>
                                        <span
                                            className={"text-sm absolute -top-2.5 left-3 z-10 px-1 bg-white rounded"}>cohWinRg</span>
                                        <input type="number" defaultValue={inputParameters["cohWinRg"]} name="cohWinRg" id=""
                                               className={"input input-bordered w-24"} onChange={handleInputChange}/>
                                    </div>

                                    <div className={"flex flex-col relative m-2"}>
                                        <span
                                            className={"text-sm absolute -top-2.5 left-3 z-10 px-1 bg-white rounded"}>windowSize</span>
                                        <input type="number" defaultValue={inputParameters["windowSizeString"]} name="windowSizeString" id=""
                                               className={"input input-bordered w-24"} onChange={handleInputChange}/>
                                    </div>
                                </div>

                                <div className={"flex flex-col relative my-4"}>
                                    <span
                                        className={"text-sm absolute -top-2.5 left-3 z-10 px-1 bg-white rounded"}>demName</span>
                                    <select name="demName" id="" defaultValue={inputParameters["demName"]} className={"select select-bordered w-full"} onChange={handleInputChange}>
                                        {
                                            parameters["demName"].map((value, index) => {
                                                return <option key={index} value={value}>{value}</option>
                                            })
                                        }
                                    </select>
                                </div>

                                <div className={"flex flex-col relative my-4"}>
                                    <span
                                        className={"text-sm absolute -top-2.5 left-3 z-10 px-1 bg-white rounded"}>orbitType</span>
                                    <select name="orbitType" id="" defaultValue={inputParameters["orbitType"]} className={"select select-bordered w-full"} onChange={handleInputChange}>
                                        {
                                            parameters["orbitType"].map((value, index) => {
                                                return <option key={index} value={value}>{value}</option>
                                            })
                                        }
                                    </select>
                                </div>

                                <div className={"flex flex-col relative my-4"}>
                                    <span
                                        className={"text-sm absolute -top-2.5 left-3 z-10 px-1 bg-white rounded"}>outputBetaBand</span>
                                    <select name="outputBetaBand" id="" defaultValue={inputParameters["outputBetaBand"]} className={"select select-bordered w-full"} onChange={handleInputChange}>
                                        {
                                            parameters["outputBetaBand"].map((value, index) => {
                                                return <option key={index} value={value}>{value}</option>
                                            })
                                        }
                                    </select>
                                </div>

                                <div className={"flex flex-col relative my-4"}>
                                    <span
                                        className={"text-sm absolute -top-2.5 left-3 z-10 px-1 bg-white rounded"}>outputGammaBand</span>
                                    <select name="outputGammaBand" id="" defaultValue={inputParameters["outputGammaBand"]} className={"select select-bordered w-full"} onChange={handleInputChange}>
                                        {
                                            parameters["outputGammaBand"].map((value, index) => {
                                                return <option key={index} value={value}>{value}</option>
                                            })
                                        }
                                    </select>
                                </div>

                                <div className={"flex flex-col relative my-4"}>
                                    <span
                                        className={"text-sm absolute -top-2.5 left-3 z-10 px-1 bg-white rounded"}>outputSigmaBand</span>
                                    <select name="outputSigmaBand" id="" defaultValue={inputParameters["outputSigmaBand"]} className={"select select-bordered w-full"} onChange={handleInputChange}>
                                        {
                                            parameters["outputSigmaBand"].map((value, index) => {
                                                return <option key={index} value={value}>{value}</option>
                                            })
                                        }
                                    </select>
                                </div>

                                <div className={"flex flex-col relative my-4"}>
                                    <span
                                        className={"text-sm absolute -top-2.5 left-3 z-10 px-1 bg-white rounded"}>subtractFlatEarthPhase</span>
                                    <select name="subtractFlatEarthPhase" id="" defaultValue={inputParameters["subtractFlatEarthPhase"]} className={"select select-bordered w-full"} onChange={handleInputChange}>
                                        {
                                            parameters["subtractFlatEarthPhase"].map((value, index) => {
                                                return <option key={index} value={value}>{value}</option>
                                            })
                                        }
                                    </select>
                                </div>

                                <div className={"flex flex-col relative my-4"}>
                                    <span
                                        className={"text-sm absolute -top-2.5 left-3 z-10 px-1 bg-white rounded"}>subtractTopographicPhase</span>
                                    <select name="subtractTopographicPhase" id="" defaultValue={inputParameters["subtractTopographicPhase"]} className={"select select-bordered w-full"} onChange={handleInputChange}>
                                        {
                                            parameters["subtractTopographicPhase"].map((value, index) => {
                                                return <option key={index} value={value}>{value}</option>
                                            })
                                        }
                                    </select>
                                </div>

                                <div className={"flex flex-col relative my-4"}>
                                    <span
                                        className={"text-sm absolute -top-2.5 left-3 z-10 px-1 bg-white rounded"}>subswath</span>
                                    <select name="subswath" id="" defaultValue={inputParameters["subswath"]} className={"select select-bordered w-full"} onChange={handleInputChange}>
                                        {
                                            parameters["subswath"].map((value, index) => {
                                                return <option key={index} value={value}>{value}</option>
                                            })
                                        }
                                    </select>
                                </div>

                                <div className={"flex flex-col relative my-4"}>
                                    <span
                                        className={"text-sm absolute -top-2.5 left-3 z-10 px-1 bg-white rounded"}>demName</span>
                                    <select name="demName" id="" defaultValue={inputParameters["demName"]} className={"select select-bordered w-full"} onChange={handleInputChange}>
                                        {
                                            parameters["demName"].map((value, index) => {
                                                return <option key={index} value={value}>{value}</option>
                                            })
                                        }
                                    </select>
                                </div>

                                <button onClick={validate} className={`btn btn-outline mt-4 w-full`}>Valider</button>
                            </div>
                        )}
                        </div>

                    </div>
                </SplitterPanel>
                <SplitterPanel size={65} minSize={55}>
                    <AreaSelector inputClasses={"w-full h-full"} className={"w-full h-full"} data={processPolygon} dataSetter={setProcessPolygon} inputPolygon={previewPolygon}></AreaSelector>
                </SplitterPanel>
            </Splitter>

        </>
    )
}

export default ProcessPage;

async function fetchParameters(setParameters, setParametersLoaded) {
    setParametersLoaded(false)
    const url = "http://localhost:8080/parameters"

    await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': "application/json"
        }
    })
        .then(res => res.json())
        .then(data => {
            setParameters(data)
            setParametersLoaded(true)
        })
}

async function fetchDownloadedImages(setImagesNames, setImagesNamesLoaded) {
    const url = "http://localhost:8080/downloaded-images"

    await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            setImagesNames(data)
            setImagesNamesLoaded(true)
        })
}

async function process(inputParameters, setResponse) {
    const url = "http://localhost:8080/process"

    let response = await fetch(url, ({
        method: 'POST',
        body: JSON.stringify(inputParameters),
        headers: {
            "Content-Type": "application/json"
        }
    }))
        .then(res => res.json())
        .then(data => setResponse(data))
}