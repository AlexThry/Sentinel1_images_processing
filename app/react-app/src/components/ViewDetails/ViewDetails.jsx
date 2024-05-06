import {Link} from "react-router-dom";
import Modal from "../Modal/Modal.jsx";

function ViewDetails() {

    return (
        <>
            <Modal>
                <div
                    className={"h-[80vh] w-[60vw] mockup-window border bg-white rounded-2xl shadow-xl relative overflow-hidden"}>
                    <Link to={".."}
                          className={"absolute top-5 left-[1.4rem] h-3 w-3 bg-red-600 rounded-full z-30 hover:bg-red-700"}>
                    </Link>

                </div>
            </Modal>
        </>
    )
}

export default ViewDetails;