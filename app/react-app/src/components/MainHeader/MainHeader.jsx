import {Link, useLocation} from "react-router-dom";

function MainHeader(){

    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <>
            <nav className={"navbar flex justify-between bg-white px-10"}>
                <div className={"flex"}>
                    <Link to={"/home"} className={"btn text-xl"}>HOME</Link>
                </div>
                <div className={"flew gap-4"}>
                    <Link to={"/download"} className={"btn btn-ghost"}>Download</Link>
                    <Link to={"/process"} className={"btn btn-ghost"}>Process</Link>
                    <Link to={"/view"} className={"btn btn-ghost"}>View</Link>
                </div>
            </nav>
        </>
    )
}

export default MainHeader;