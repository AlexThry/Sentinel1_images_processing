import classes from "./ProcessPage.module.scss";
import AreaSelector from "../../components/AreaSelector/AreaSelector.jsx";

function ProcessPage() {
    return (
        <>
            <AreaSelector inputStyle={{height: "700px", width: "90%", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}/>
        </>
    )
}

export default ProcessPage;