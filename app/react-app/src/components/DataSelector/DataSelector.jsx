import {Link} from "react-router-dom";

function DataSelector({data}) {

    return (
        <>
            <div className="overflow-x-auto max-h-80 overflow-y-scroll">
                <table className={"table"}>
                    <thead>
                        <tr>
                            <th></th>
                            <td>Date</td>
                            <td>Informations</td>
                            <td>Selection</td>
                        </tr>
                    </thead>
                    <tbody>
                    {[...Array(10)].map((_, index) => (
                        <tr key={index}>
                            <th>{index + 1}</th>
                            <td>04/17/2024</td>
                            <td><Link to={`${index + 1}`} className={"hover:underline hover:text-blue-500"}>Voir plus -&gt;</Link></td>
                            <td><input type="checkbox" className={"checkbox checkbox-sm"}/></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default DataSelector;