import MainHeader from "../../components/MainHeader/MainHeader.jsx";
import {Outlet} from "react-router-dom";
import classes from "./RootLayout.module.scss";
import {MainDataContext, MainDataProvider} from "../../DataProviders/MainDataProvider/MainDataProvider.jsx";

function RootLayout(){
    return (
        <MainDataProvider>
            <div className={"h-screen"}>
                <MainHeader/>
                <Outlet className={"h-full"}/>
            </div>
        </MainDataProvider>
    )
}

export default RootLayout