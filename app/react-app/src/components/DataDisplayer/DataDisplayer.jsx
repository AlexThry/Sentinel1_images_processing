import classes from "./DataDisplayer.module.scss"

function DataDisplayer({data}) {
    let res;
    if (typeof data === 'string') {
        res = (
            <>
                <div className={classes.wrapper}>
                    <p className={classes.content}>{data}</p>
                </div>
            </>
        )
    }
    return res;
}

export default DataDisplayer;