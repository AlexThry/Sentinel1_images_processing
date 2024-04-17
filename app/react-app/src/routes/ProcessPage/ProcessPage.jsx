import AreaSelector from "../../components/AreaSelector/AreaSelector.jsx";
import {DataContext, DataProvider} from "../../components/DataProvider/DataProvider.jsx";
import DataDisplayer from "../../components/DataDisplayer/DataDisplayer.jsx";
import {useContext, useEffect} from "react";
import {Form} from "react-router-dom";


function ProcessPage() {
    const {data} = useContext(DataContext)


    useEffect(() => {
        console.log(data);
    }, [data]);

    return (
        <>
            <Form className={""}>
                <AreaSelector inputClasses={"h-20"}/>
                <DataDisplayer data={data}/>
            </Form>
        </>
    )
}

export default ProcessPage;