import {Link, useLocation} from "react-router-dom";

function MainHeader(){

    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <>
            <nav className={"navbar flex justify-between bg-white px-10"}>
                <div className={"flex"}>
                    <Link to={"/"} className={"btn text-xl"}>HOME</Link>
                </div>
                <div className={"flew gap-4"}>
                    <Link to={"/download"} className={`btn btn-ghost ${currentPath === "/download" ? "bg-amber-50" : ""}`}>Download</Link>
                    <Link to={"/process"} className={`btn btn-ghost ${currentPath === "/process" ? "bg-amber-50" : ""}`}>Process</Link>
                    <Link to={"/view"} className={`btn btn-ghost ${currentPath === "/view" ? "bg-amber-50" : ""}`}>View</Link>
                </div>
            </nav>
        </>
    )
}

export default MainHeader;