import {useContext, useEffect, useState} from "react";
import {ViewDataContext} from "../../DataProviders/ViewDataProvider/ViewDataProvider.jsx";

function ViewSelector({setProcessed, processed, processedLoadded, setProcessedLoaded}) {

    const {setPreviewPolygon, setSelectedFolder, subsFolders, setSubsFolders} = useContext(ViewDataContext)



    useEffect(() => {
        fetchProcessed(setProcessed)
            .then(() => setProcessedLoaded(true))
            .catch(e => console.log(e))
    }, []);


    const handleRadioChange = (event) => {
        let rawCoordinates = event.target.value.replace("POLYGON((", "").replace("))", "").split(",")
        let coordinates = rawCoordinates.map(coordinate => coordinate.split(" ").map(str => parseFloat(str)));
        setPreviewPolygon(coordinates)
        setSelectedFolder(event.target.dataset.folder)
        fetchFolderSize("orthorectification/" + event.target.dataset.folder, setSubsFolders)
    }

    useEffect(() => {
        console.log(subsFolders)
    }, [subsFolders]);

    return (
        <>
        {processedLoadded &&
            <table className={"table"}>
                <thead>
                <tr>
                    <th>Date de traitement</th>
                    <th>Show</th>
                </tr>
                </thead>
                <tbody>

                    {
                        processed.map((group, index) => {
                            if (group) {
                            return (
                                <tr key={index}>
                                    <td>{group["date"]}</td>
                                    <td><input type="radio" name={"show"} className={"radio"} onChange={handleRadioChange} value={group["polygon"]} data-folder={group["folder"]}/></td>
                                </tr>
                                )
                            }


                })
                    }

                </tbody>
            </table>
        }
        </>
    )
}

export default ViewSelector;

async function fetchProcessed(setProcessed) {
    try {
        const url = "http://localhost:8080/processed"
        await fetch(url, {
            method: 'POST',
            body: JSON.stringify({}),
            headers: {
                'Content-Type': "application/json"
            }
        })
            .then(res => res.json())
            .then(data => setProcessed(data))
    } catch (e) {
        console.log("processing")
    }
}

async function fetchFolderSize(folderPath, setFolderSize) {
    const url = "http://localhost:8080/folder-subs";
    await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            path: folderPath
        }),
        headers: {
            'Content-Type': "application/json"
        }
    })
        .then(res => res.json())
        .then(data => setFolderSize(data.subs))
}
