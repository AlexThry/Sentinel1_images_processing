import {Link} from "react-router-dom";

function DownloadSelector({data, state, setState}) {

    const handleCheckboxChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.checked,
        });
    };

    return (
        <>
            <div className="overflow-x-auto max-h-80 overflow-y-scroll">

                <table className={"table"}>
                    <thead>
                    <tr>
                        <td>Date</td>
                        <td>Informations</td>
                        <td>Selection</td>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        Object.keys(data.features).map(key => {

                            let date = new Date(data.features[key].properties.startTime)
                            date = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;


                            return (
                                <tr key={key}>
                                    <td>{date}</td>
                                    <td><Link to={key} className={"hover:text-blue-500 hover:underline"}>Voir plus
                                        -&gt;</Link></td>
                                    <td><input
                                        type="checkbox"
                                        checked={state[key] || false}
                                        onChange={handleCheckboxChange}
                                        name={key}
                                        className={"checkbox checkbox-md"}
                                    /></td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>

            </div>
        </>
    )
}

export default DownloadSelector;