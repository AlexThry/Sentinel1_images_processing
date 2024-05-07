import {Link, useLocation} from "react-router-dom";

function MainHeader(){

    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <>
            <nav className={"navbar flex justify-between bg-white px-10"}>
                <div className={"flex"}>
                    <Link to={"/"} className={"btn text-xl"}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                             className="w-6 h-6">
                            <path
                                d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z"/>
                            <path
                                d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z"/>
                        </svg>


                    </Link>
                </div>
                <div className={"flew gap-4"}>
                    <Link to={"/download"}
                          className={`btn btn-ghost ${currentPath === "/download" ? "bg-amber-50" : ""}`}>Téléchargement</Link>
                    <Link to={"/process"}
                          className={`btn btn-ghost ${currentPath === "/process" ? "bg-amber-50" : ""}`}>Traitement</Link>
                    <Link to={"/view"}
                          className={`btn btn-ghost ${currentPath === "/view" ? "bg-amber-50" : ""}`}>Visualisation</Link>
                </div>
            </nav>
        </>
    )
}

export default MainHeader;