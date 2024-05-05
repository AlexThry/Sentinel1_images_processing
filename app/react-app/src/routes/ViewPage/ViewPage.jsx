import {Splitter, SplitterPanel} from "primereact/splitter";
import AreaSelector from "../../components/AreaSelector/AreaSelector.jsx";
import {useContext, useEffect, useState} from "react";
import ViewSelector from "../../components/ViewSelector/ViewSelector.jsx";
import {ViewDataContext} from "../../DataProviders/ViewDataProvider/ViewDataProvider.jsx";
import ImagesViewer from "../../components/ImagesViewer/ImagesViewer.jsx";

function ViewPage() {

    const {previewPolygon, selectedFolder} =useContext(ViewDataContext)

    const [processed, setProcessed] = useState([])

    const [processedLoadded, setProcessedLoaded] = useState(false)
    const [geometryGround, setGeometryGround] = useState(false)
    const [imageType, setImageType] = useState("coh")

    const handleGeometryToggle = (event) => {
        setImageType("coh")
        if (event.target.checked) {
            setGeometryGround(true)
        } else {
            setGeometryGround(false)
        }
    }

    useEffect(() => {
        console.log(geometryGround)
    }, [geometryGround]);

    const handleImageTypeChange = (event) => {
        setImageType(event.target.value)
    }

    return (
        <>
            <Splitter className={"h-[calc(100vh-4rem)]"}>
                <SplitterPanel size={20} minSize={20} className={"p-4 overflow-y-scroll"}>
                    <h1 className={"font-bold text-xl"}>Type de géometrie</h1>
                    <label className="label cursor-pointer">
                        <span className="label-text">Géométrie sol</span>
                        <input type="checkbox" className="toggle" onChange={handleGeometryToggle}/>
                    </label>
                    <div className="divider"></div>
                    <h1 className={"font-bold text-xl"}>Type d'image</h1>
                    {!geometryGround && (
                        <>
                            <div className={"flex flex-col"}>
                                <label className={"label cursor-pointer"}>
                                    <span className="label-text">Coh</span>
                                    <input type="radio" className={"radio"} name={"image-type"}
                                           onChange={handleImageTypeChange}
                                           value={"coh"} defaultChecked/>
                                </label>
                                <label className={"label cursor-pointer"}>
                                    <span className="label-text">I</span>
                                    <input type="radio" className={"radio"} name={"image-type"}
                                           onChange={handleImageTypeChange}
                                           value={"i"}/>
                                </label>
                                <label className={"label cursor-pointer"}>
                                    <span className="label-text">Q</span>
                                    <input type="radio" className={"radio"} name={"image-type"}
                                           onChange={handleImageTypeChange}
                                           value={"q"}/>
                                </label>
                            </div>
                            <div className="divider"></div>
                        </>
                    )}
                    {geometryGround && (
                        <>
                            <div className={"flex flex-col"}>
                                <label className={"label cursor-pointer"}>
                                    <span className="label-text">Coh</span>
                                    <input type="radio" className={"radio"} name={"image-type"}
                                           onChange={handleImageTypeChange}
                                           value={"coh"} defaultChecked/>
                                </label>
                                <label className={"label cursor-pointer"}>
                                    <span className="label-text">Phase</span>
                                    <input type="radio" className={"radio"} name={"image-type"}
                                           onChange={handleImageTypeChange}
                                           value={"phase"}/>
                                </label>
                            </div>
                            <div className="divider"></div>
                        </>
                    )}
                    <h1 className={"font-bold text-xl"}>Choix de la pile</h1>

                    <ViewSelector setProcessed={setProcessed} processed={processed} processedLoadded={processedLoadded}
                                  setProcessedLoaded={setProcessedLoaded}></ViewSelector>
                </SplitterPanel>
                <SplitterPanel size={80} minSize={80}>
                    <div className={"grid grid-cols-1 grid-rows-[30%,70%] h-full"}>
                        <div className={""}>
                            <AreaSelector className={"w-full h-full"} inputClasses={"w-full h-full"}
                                          inputPolygon={previewPolygon}/>
                        </div>
                        <div className={""}>
                            <ImagesViewer folderName={selectedFolder} geometry={geometryGround} imageType={imageType}/>
                        </div>
                    </div>
                </SplitterPanel>
            </Splitter>
        </>
    )
}

export default ViewPage;