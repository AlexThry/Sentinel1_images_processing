import Markdown from 'react-markdown'
import {useEffect, useState} from "react";
import remarkGfm from 'remark-gfm'



function FrontPage() {
    const [markdown, setMarkdown] = useState('');
    const [gptPath, setGptPath] = useState("")

    useEffect(() => {
        fetch('../../README.md')
            .then(response => response.text())
            .then(text => setMarkdown(text));

        fetchGptPath(setGptPath)
    }, []);

    function validateHandeler() {
        setGptPathFetch(gptPath)
    }

    return (
        <>
            <div className={"flex relative m-2"}>
                <span
                    className={"text-sm absolute -top-2.5 left-3 z-10 px-1 bg-white rounded"}>Chemin Absolu GPT</span>
                <input type="text" name="gptPath"
                       className={"input input-bordered w-full"} value={gptPath} onChange={(e) => setGptPath(e.target.value)}/>
                <input type="button" className={"btn ml-2"} value={"Valider"} onClick={validateHandeler}/>
            </div>
            <Markdown className={"prose lg:prose-xl mx-auto mt-6 w-full "}>{markdown}</Markdown>
        </>
    )
}

export default FrontPage;

async function fetchGptPath(setGptPath) {
    const url = "http://localhost:8080/gpt-path"
    await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': "application/json"
        }
    })
        .then(res => res.json())
        .then(path => setGptPath(path))
}


async function setGptPathFetch(gptPath) {
    const url = "http://localhost:8080/gpt-path"
    await fetch(url, {
        method: 'POST',
        body: JSON.stringify({"path": gptPath}),
        headers: {
            'Content-Type': "application/json"
        }
    })
        .then(res => res.json())
        .then(res => console.log(res))
}