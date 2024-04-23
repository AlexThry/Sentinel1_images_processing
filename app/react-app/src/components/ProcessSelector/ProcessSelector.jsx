function ProcessSelector({data, state, setState}) {

    const handleCheckboxChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.checked,
        });
    };


}