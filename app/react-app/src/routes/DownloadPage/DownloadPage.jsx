import AreaSelector from "../../components/AreaSelector/AreaSelector.jsx";
import {DataContext} from "../../components/DataProvider/DataProvider.jsx";
import DataDisplayer from "../../components/DataDisplayer/DataDisplayer.jsx";
import {useContext, useEffect, useState} from "react";
import {Form, Outlet} from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DataSelector from "../../components/DataSelector/DataSelector.jsx";


function DownloadPage() {
    const {data} = useContext(DataContext)
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())


    useEffect(() => {
        console.log(data);
    }, [data]);

    return (
        <>
            <Outlet/>
            <div className={"grid grid-cols-[30vw_1fr] h-[calc(100vh-4rem)] w-screen"}>
                <div className={"w-full p-3"}>
                    <h1 className={"text-2xl font-bold mb-4"}>Selection</h1>

                    <Form method={"post"} className={""}>
                        {data && (
                            <DataDisplayer data={data} dataName={"Selection"} className={""}/>

                        )}
                        <div className={"flex flex-col gap-4"}>
                            <div className={"flex flex-col relative"}>
                                <span className={"text-sm absolute -top-2.5 left-3 z-10 px-1 bg-white rounded"}>Date de début</span>
                                <DatePicker className={"w-full input input-bordered w-full"} name={"startDate"}
                                            selected={startDate} onChange={date => setStartDate(date)} required/>
                            </div>

                            <div className={"flex flex-col relative"}>
                                <span className={"text-sm absolute -top-2.5 left-3 z-10 px-1 bg-white rounded"}>Date de fin</span>
                                <DatePicker className={"w-full input input-bordered w-full"} name={"endDate"}
                                            selected={endDate} onChange={date => setEndDate(date)} required/>
                            </div>
                            <div className={"flex flex-col relative"}>
                                <span className={"text-sm absolute -top-2.5 left-3 z-10 px-1 bg-white rounded"}>Nombre d'image max</span>
                                <input className={"input input-bordered w-full"} name="maxDownload" type="number"
                                       required/>
                            </div>
                        </div>

                        <DataSelector data={"prout"}/>

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

                        <button type="submit" className={"btn btn-outline mt-4 w-full"}>Valider et
                            télécharger
                        </button>

                    </Form>
                </div>
                <AreaSelector className={"w-full"} inputClasses={""}/>
            </div>

        </>
    )
}

export default DownloadPage;

export async function action({request}) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    console.log(JSON.stringify(data))
    if (data.polygon === "") {
        alert("Veuillez choisir une zone.")
    } else {
        await fetch("http://localhost:8080/download", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': "application/json"
            }
        })
            .then(() => alert("Download started"))
            .catch(error => console.log(error))
    }

    return null;
}