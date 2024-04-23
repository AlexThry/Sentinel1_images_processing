import AreaSelector from "../../components/AreaSelector/AreaSelector.jsx";
import {DataContext, DataProvider} from "../../components/DataProvider/DataProvider.jsx";
import DataDisplayer from "../../components/DataDisplayer/DataDisplayer.jsx";
import {useContext, useEffect} from "react";
import {Form} from "react-router-dom";
import {Splitter, SplitterPanel} from "primereact/splitter";
import DownloadSelector from "../../components/DownloadSelector/DownloadSelector.jsx";


function ProcessPage() {
    const {processPolygon, setProcessPolygon} = useContext(DataContext)


    useEffect(() => {
        console.log(processPolygon);
    }, [processPolygon]);

    return (
        <>
            <Splitter className={"h-[calc(100vh-4rem)]"}>
                <SplitterPanel size={30} minSize={30}>
                    <div>

                    </div>
                </SplitterPanel>
                <SplitterPanel size={70} minSize={60}>
                    <AreaSelector inputClasses={"w-full h-full"} dataSetter={setProcessPolygon}></AreaSelector>
                </SplitterPanel>
            </Splitter>

            </>
    )
}

export default ProcessPage;