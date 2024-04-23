import Modal from "../Modal/Modal.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect} from "react";
import {DataContext} from "../DataProvider/DataProvider.jsx";

function DataDetails() {
    const {images} = useContext(DataContext);
    let { id } = useParams();

    return (
        <>
            <Modal>
                <div className={"h-[80vh] w-[60vw] mockup-window border bg-white rounded-2xl shadow-xl relative overflow-hidden"}>
                    <Link to={".."} className={"absolute top-[1.125rem] left-[1.25rem] h-4 w-4 bg-red-600 rounded-full z-30 hover:bg-red-700"}>

                    </Link>
                    <div className={"py-14 px-10 max-h-full overflow-y-scroll"}>
                        <div>
                            <div>
                                <h1 className={"font-bold"}>Coordonnées</h1>
                                <table className={"table w-full"}>
                                    <thead>
                                        <tr>
                                            <td></td>
                                            <td className={"text-center"}>Longitude</td>
                                            <td className={"text-center"}>Latitude</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {images.features[id].geometry.coordinates["0"].slice(0, -1).map((coordinate, index) => (
                                        <tr key={index}>
                                            <th>{index}</th>
                                            <td className={"text-center"}>{coordinate[0]}</td>
                                            <td className={"text-center"}>{coordinate[1]}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            <div>
                                <h1 className={"font-bold"}>Propriétés</h1>
                                <table className={"table max-w-full"}>
                                    <thead>
                                    <tr>
                                        <td className={"text-center"}>Propriété</td>
                                        <td className={"text-center"}>Valeur</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {Object.keys(images.features[id].properties).map((property, index) => (
                                        <tr key={index}>
                                            <td className={"text-center"}>{property}</td>
                                            <td className={"text-center max-w-32 break-words"}>{images.features[id].properties[property]}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>

                            </div>

                        </div>
                    </div>

                </div>

            </Modal>
        </>
    )
}

export default DataDetails;