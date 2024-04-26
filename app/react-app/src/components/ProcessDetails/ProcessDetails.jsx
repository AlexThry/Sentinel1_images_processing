import Modal from "../Modal/Modal.jsx";
import {Link, useParams} from "react-router-dom";
import {useContext, useEffect} from "react";
import {ProcessDataContext} from "../ProcessDataProvider/ProcessDataProvider.jsx";

function ProcessDetails() {

    let { id } = useParams();

    const {downloaded} = useContext(ProcessDataContext)

    const images = downloaded[0]["images"];

    useEffect(() => {
        console.log(images)
    }, [images])

    return (
        <>
            <Modal>
                <div
                    className={"h-[80vh] w-[60vw] mockup-window border bg-white rounded-2xl shadow-xl relative overflow-hidden"}>
                    <Link to={".."}
                          className={"absolute top-5 left-[1.4rem] h-3 w-3 bg-red-600 rounded-full z-30 hover:bg-red-700"}>
                    </Link>
                    <div className={"px-10 max-h-full overflow-y-scroll"}>
                        {Object.keys(images).map((key, index) => {
                            return (
                                <>

                                <h1 className={"text-xl"}>Image {index}</h1>
                                <table className={"table w-full"}>
                                    <thead>
                                    <tr>
                                        <td className={"text-center"}>Propriété</td>
                                        <td className={"text-center"}>Description</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {Object.keys(images[key]["properties"]).map(subKey => {
                                        return (
                                            <tr>
                                                <td className={"text-center"}>{subKey}</td>
                                                <td className={"text-center max-w-32 break-words"}>{images[key]["properties"][subKey]}</td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                                </>
                            );
                        })}
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default ProcessDetails;