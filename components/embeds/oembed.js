import React, {useEffect, useState} from "react";

export default function OEmbed(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(true);
    const [options, setOptions] = useState(null)
    const [html, setHtml] = useState({
        __html: props.html
    })

    if (error || !isLoaded) {
        return <></>
    }else {
        return (
            <>
                <div className={"my-4 w-full h-42 rounded-md overflow-hidden mx-auto border shadow-md "} dangerouslySetInnerHTML={
                    html
                }/>
            </>
        );
    }
}
