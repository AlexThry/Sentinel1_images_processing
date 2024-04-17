import {useNavigate} from "react-router-dom";

function Modal({children}) {
    const navigate = useNavigate();
    function closeHandler() {
        navigate('..');
    }

    return (
        <>
            <div className={"bg-gray-700 opacity-20 h-screen w-screen absolute top-0 left-0 z-20"} onClick={closeHandler}/>
            <dialog open className={"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 rounded-2xl"}>
                {children}
            </dialog>
        </>
    )
}

export default Modal;