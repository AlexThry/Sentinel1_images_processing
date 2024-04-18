import AreaSelector from "../../components/AreaSelector/AreaSelector.jsx";
import {DataContext} from "../../components/DataProvider/DataProvider.jsx";
import DataDisplayer from "../../components/DataDisplayer/DataDisplayer.jsx";
import {useContext, useEffect, useState} from "react";
import {Form, Outlet} from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DataSelector from "../../components/DataSelector/DataSelector.jsx";


function DownloadPage() {
    const {data, images, setImages} = useContext(DataContext)
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [downloadStarted, setDownloadStarted] = useState(false)

    const [dataLoaded, setDataLoaded] = useState(false)
// https://datapool.asf.alaska.edu/BROWSE/SA/S1A_IW_SLC__1SDV_20240413T054406_20240413T054433_053411_067A88_8905.jpg

    useEffect(() => {

        if (data && startDate && endDate) {
            setDataLoaded(false)
            search(data, startDate, endDate).then(images => {
                setImages(images)
                setDataLoaded(true);
            })

        }
    }, [data, startDate, endDate]);

    return (
        <>
            <Outlet/>
            <div className={"grid grid-cols-[30vw_1fr] h-[calc(100vh-4rem)] w-screen"}>
                <div className={"w-full p-3 overflow-y-scroll"}>
                    <h1 className={"text-2xl font-bold mb-4"}>Selection</h1>

                    <Form method={"post"} className={""}>
                        {data && (
                            <DataDisplayer data={data} dataName={"Selection"} className={""}/>
                        )}

                        <div className={"flex flex-col gap-4"}>
                            <div className={"flex flex-col relative"}>
                                <span className={"text-sm absolute -top-2.5 left-3 z-10 px-1 bg-white rounded"}>Date de début</span>
                                <DatePicker className={"w-full input input-bordered w-full"}
                                            selected={startDate} onChange={date => setStartDate(date)} required/>
                            </div>

                            <div className={"flex flex-col relative"}>
                                <span className={"text-sm absolute -top-2.5 left-3 z-10 px-1 bg-white rounded"}>Date de fin</span>
                                <DatePicker className={"w-full input input-bordered w-full"}
                                            selected={endDate} onChange={date => setEndDate(date)} required/>
                            </div>
                        </div>

                        {dataLoaded && !(images.features.length === 0) && (
                            <DataSelector data={images}/>
                        )}
                        {dataLoaded && images.features.length === 0 && (
                            <div className={"flex justify-center mt-4 text-justify"}>
                                <h1 className={"text-lg font-bold"}>Pas d'images pour cette zone ou cette période</h1>
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
                                <input className={"input input-bordered w-full"} name="login" type="text"/>
                            </div>
                            <div className={"flex flex-col relative"}>
                                <span className={"text-sm absolute -top-2.5 left-3 z-10 px-1 bg-white rounded"}>Password ASF</span>
                                <input className={"input input-bordered w-full"} name="password" type="password"/>
                            </div>
                        </div>
                        <button type="submit" onClick={() => setDownloadStarted(true)} className={`btn btn-outline mt-4 w-full ${!dataLoaded || images.features.length === 0 ? 'btn-disabled' : ''}`}>Valider et
                            télécharger
                        </button>
                        {downloadStarted && (
                            <div className={"alert alert-success mt-4 rounded-xl"}>Démarage du téléchargement</div>
                        )}

                    </Form>
                </div>
                <AreaSelector className={"w-full"} inputClasses={""}/>
            </div>

        </>
    )
}

export default DownloadPage;

export async function search(polygon, startDate, endDate) {
    let response= await fetch("http://localhost:8080/search", {
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

export async function action({request}) {

    let formData = await request.formData();
    formData = Object.fromEntries(formData);
    if (formData.polygon === "") {
        alert("Veuillez choisir une zone.")
    } else {

        let selected = [];
        for (let key in formData) {
            if (formData[key] === "on") {
                selected.push(parseInt(key));
            }
        }

        let newData = {
            selected: JSON.stringify(selected),
            login: formData.login,
            password: formData.password
        };
        JSON.stringify(selected)
        console.log(newData)

        await fetch("http://localhost:8080/download", {
            method: "POST",
            body: JSON.stringify(newData),
            headers: {
                'Content-Type': "application/json"
            }
        })
            .then(res => console.log(res))
            .catch(error => console.log(error))

    }

    return null;
}