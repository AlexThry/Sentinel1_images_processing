import MainHeader from "../../components/MainHeader/MainHeader.jsx";
import {Outlet} from "react-router-dom";
import classes from "./RootLayout.module.scss";

function RootLayout(){
    return (
        <div className={classes.root}>
            <MainHeader/>
            <Outlet/>
        </div>
    )
}

export default RootLayout