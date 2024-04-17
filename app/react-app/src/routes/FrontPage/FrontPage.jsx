import Markdown from 'react-markdown'
import {useEffect, useState} from "react";
import remarkGfm from 'remark-gfm'



function FrontPage() {
    const [markdown, setMarkdown] = useState('');

    useEffect(() => {
        fetch('../../README.md')
            .then(response => response.text())
            .then(text => setMarkdown(text));
    }, []);

    return (
        <>
            <Markdown className={"prose lg:prose-xl mx-10 mt-6 w-full"}>{markdown}</Markdown>
        </>
    )
}

export default FrontPage;