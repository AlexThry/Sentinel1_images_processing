import AreaSelector from "../../components/AreaSelector/AreaSelector.jsx";
import {DataContext} from "../../components/DataProvider/DataProvider.jsx";
import DataDisplayer from "../../components/DataDisplayer/DataDisplayer.jsx";
import {useContext, useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DownloadSelector from "../../components/DownloadSelector/DownloadSelector.jsx";
import { Splitter, SplitterPanel } from "primereact/splitter";
import {Outlet} from "react-router-dom";




function DownloadPage() {
    const {downloadPolygon, setDownloadPolygon, images, setImages} = useContext(DataContext)
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [downloadStarted, setDownloadStarted] = useState(false)
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [buttonClicked, setButtonClicked] = useState(false);
    const [downloadMessage, setDownloadMessage] = useState("")

    const [checkboxStates, setCheckboxStates] = useState({});

    const [dataLoaded, setDataLoaded] = useState(false)
// https://datapool.asf.alaska.edu/BROWSE/SA/S1A_IW_SLC__1SDV_20240413T054406_20240413T054433_053411_067A88_8905.jpg

    useEffect(() => {

        if (downloadPolygon && startDate && endDate) {
            setDataLoaded(false)
            search(downloadPolygon, startDate, endDate).then(images => {
                setImages(images)
                setDataLoaded(true);
            })

        }
    }, [downloadPolygon, startDate, endDate]);

    useEffect(() => {
        console.log(downloadMessage);
    }, [downloadMessage]);

    useEffect(() => {
        if (buttonClicked) {
            setDownloadMessage("Le téléchargement est en cours !")
            download({selected: checkboxStates, login: login, password: password})
                .then(message => setDownloadMessage(message))
                .then(() => console.log(downloadMessage))

            setButtonClicked(false);
        }
    }, [buttonClicked]);

    const handleInputChange = (event) => {
        switch (event.target.name) {
            case 'login':
                setLogin(event.target.value);
                break;
            case 'password':
                setPassword(event.target.value);
                break;
            default:
                break;
        }
    };

    return (
        <>
            <Outlet/>
            <Splitter className={"h-[calc(100vh-4rem)]"}>
                <SplitterPanel size={30} minSize={30} className={"overflow-y-scroll"}>
                    <div className={"w-full p-3"}>
                        <h1 className={"text-2xl font-bold mb-4"}>Selection</h1>

                        <div>
                            {downloadPolygon && (
                                <DataDisplayer data={downloadPolygon} dataName={"Selection"} className={"shadow"}/>
                            )}

                            <div className={"flex flex-col gap-4"}>
                                <div className={"flex flex-col relative"}>
                                    <span className={"text-sm absolute -top-2.5 left-3 z-10 px-1 bg-white rounded"}>Date de début</span>
                                    <DatePicker className={"input input-bordered w-full"}
                                                selected={startDate} onChange={date => setStartDate(date)} required/>
                                </div>

                                <div className={"flex flex-col relative"}>
                                    <span className={"text-sm absolute -top-2.5 left-3 z-10 px-1 bg-white rounded"}>Date de fin</span>
                                    <DatePicker className={"input input-bordered w-full"}
                                                selected={endDate} onChange={date => setEndDate(date)} required/>
                                </div>
                            </div>

                            {dataLoaded && !(images.features.length === 0) && (
                                <DownloadSelector data={images} state={checkboxStates} setState={setCheckboxStates}/>
                            )}
                            {dataLoaded && images.features.length === 0 && (
                                <div className={"flex justify-center mt-4 text-justify"}>
                                    <h1 className={"text-lg font-bold text-center"}>Pas d'images pour cette zone ou cette
                                        période</h1>
                                </div>
                            )}
                            {!dataLoaded && (
                                <div className={"flex justify-center mt-4"}>
                                    <span className="loading loading-spinner loading-lg"></span>
                                </div>
                            )}

                            <div className="divider"></div>

                            <div className={"flex flex-col gap-4"}>
                                <h1 className={"text-2xl font-bold"}>Identifiants ASF</h1>
                                <div className={"flex flex-col relative"}>
                                    <span className={"text-sm absolute -top-2.5 left-3 z-10 px-1 bg-white rounded"}>Login ASF</span>
                                    <input className={"input input-bordered w-full"} name="login" type="text" value={login} onChange={handleInputChange}/>
                                </div>
                                <div className={"flex flex-col relative"}>
                                    <span className={"text-sm absolute -top-2.5 left-3 z-10 px-1 bg-white rounded"}>Password ASF</span>
                                    <input className={"input input-bordered w-full"} name="password" type="password" value={password} onChange={handleInputChange}/>
                                </div>
                            </div>
                            <button onClick={() => {
                                setButtonClicked(true);
                                setDownloadStarted(true);
                            }}
                                    className={`btn btn-outline mt-4 w-full ${!dataLoaded || images.features.length === 0 ? 'btn-disabled' : ''}`}>Valider
                                et
                                télécharger
                            </button>

                            {(downloadMessage === "Erreur lors de la connexion\n" || downloadMessage === "Erreur lors du téléchargement\n") && (
                                <div className={"alert alert-error mt-4 rounded-xl"}>{downloadMessage}</div>
                            )}
                            {downloadStarted && (
                                <div className={"alert alert-success mt-4 rounded-xl"}>Le téléchargement à débuté</div>
                            )}
                        </div>
                    </div>
                </SplitterPanel>
                <SplitterPanel size={70} minSize={60}>
                    <AreaSelector className={"w-full h-full"} inputClasses={"w-full h-full"} dataSetter={setDownloadPolygon}/>
                </SplitterPanel>
            </Splitter>
        </>
    )
}

export default DownloadPage;

export async function search(polygon, startDate, endDate) {
    let response = await fetch("http://localhost:8080/search", {
        method: "POST",
        body: JSON.stringify({
            "polygon": polygon,
            "startDate": startDate,
            "endDate": endDate
        }),
        headers: {
            'Content-Type': "application/json"
        }
    })
    let resData = await response.json();
    if (resData) {
        return resData;
    } else {
        console.error('Empty or invalid JSON received');
        return null;
    }
}

export async function download(body) {

    console.log(body.selected)
    let selected = [];
    for (let key in body["selected"]) {
        if (body["selected"][key] === true) {
            selected.push(parseInt(key));
        }
    }
    console.log(selected)

    let newData = {
        selected: JSON.stringify(selected),
        login: body.login,
        password: body.password
    };
    JSON.stringify(selected)
    console.log(newData)


    return await fetch("http://localhost:8080/download", {
        method: "POST",
        body: JSON.stringify(newData),
        headers: {
            'Content-Type': "application/json"
        }
    })
        .then(res => res.json())
        .then(data => {
            return data
        })
        .catch(error => console.log(error))
}