import Modal from "../Modal/Modal.jsx";
import {Link} from "react-router-dom";

function DataDetails() {
    return (
        <>
            <Modal>
                <div className={"h-[80vh] w-[60vw] bg-white rounded-2xl"}>
                    <Link to={".."}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" className="w-10 h-10 m-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                        </svg>
                    </Link>

                </div>

            </Modal>
        </>
    )
}

export default DataDetails;