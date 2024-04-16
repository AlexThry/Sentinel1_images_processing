import AreaSelector from "../../components/AreaSelector/AreaSelector.jsx";
import {DataContext} from "../../components/DataProvider/DataProvider.jsx";
import DataDisplayer from "../../components/DataDisplayer/DataDisplayer.jsx";
import {useContext, useEffect, useState} from "react";
import classes from "./DownloadPage.module.scss"
import {Form} from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function DownloadPage() {
    const {data} = useContext(DataContext)
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())


    useEffect(() => {
        console.log(data);
    }, [data]);

    return (
        <>
            <AreaSelector inputStyle={{
                height: "70vh",
                width: "90%",
                margin: "20px 0"
            }}/>
            <Form method={"post"} className={classes.form}>
                <input name={"polygon"} type="hidden" value={data} required/>
                {data && (
                    <div className={classes.inputWrapper}>
                        <span>Coordonnées de la séléction</span>
                        <DataDisplayer data={data} className={classes.dataDisplayer}/>
                    </div>
                )}
                <div className={classes.formWrapper}>
                    <div className={classes.inputWrapper}>
                        <span>Date de début</span>
                        <DatePicker name={"startDate"} selected={startDate} onChange={date => setStartDate(date)} required/>
                    </div>

                    <div className={classes.inputWrapper}>
                        <span>Date de fin</span>
                        <DatePicker name={"endDate"} selected={endDate} onChange={date => setEndDate(date)} required/>
                    </div>
                    <div className={classes.inputWrapper}>
                        <span>Nombre d'image max à télécharger</span>
                        <input name="maxDownload" type="number" required/>
                    </div>
                </div>

                <div className={classes.formWrapper}>
                    <div className={classes.inputWrapper}>
                        <span>Login ASF</span>
                        <input name="login" type="text" required/>
                    </div>
                    <div className={classes.inputWrapper}>
                        <span>Password ASF</span>
                        <input name="password" type="password" required/>
                    </div>
                </div>

                <button type="submit">Valider et télécharger</button>

            </Form>

        </>
    )
}

export default DownloadPage;

export async function action({request}) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    console.log(data)
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