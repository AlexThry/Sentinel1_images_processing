import classes from "./MainHeader.module.scss"
import {Link, useLocation} from "react-router-dom";

function MainHeader(){

    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <>
            <nav className={classes.nav}>
                <div className={classes.buttons}>
                    <Link to={"/home"} className={`${classes.button} ${classes.homeButton} ${currentPath === "/home" ? classes.active : ""}`}>HOME</Link>
                    <Link to={"/download"} className={`${classes.button} ${currentPath === "/download" ? classes.active : ""}`}>Download</Link>
                    <Link to={"/process"} className={`${classes.button} ${currentPath === "/process" ? classes.active : ""}`}>Process</Link>
                    <Link to={"/view"} className={`${classes.button} ${currentPath === "/view" ? classes.active : ""}`}>View</Link>
                </div>
            </nav>
        </>
    )
}

export default MainHeader;