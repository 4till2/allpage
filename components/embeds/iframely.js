import React, {useEffect, useState} from "react";

export default function Iframely(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [options, setOptions] = useState(null)
    const [html, setHtml] = useState({
        __html: "<div />"
    })
    useEffect(() => {
        if (props && props.externalId) {
            fetch(`https://cdn.iframe.ly/${props.externalId}.json`)
                .then(res => res.json())
                .then(
                    (res) => {
                        setIsLoaded(true);
                        setOptions(res.options)
                        if (res.html) {
                            setHtml({__html: res.html});
                        } else if (res.error) {
                            setError({code: res.error, message: res.message});
                        }
                    },
                    (error) => {
                        setIsLoaded(true);
                        setError(error);
                    }
                )
        } else {
            setError({code: 400, message: 'Provide url attribute for the element'})
        }
    }, []);

    useEffect((props) => {
        const loaded = window.iframely && window.iframely.load();
    });


    if (error) {
        return <></>
    } else if (!isLoaded) {
        return <div className={"my-4 w-80 rounded-md overflow-hidden mx-auto border shadow-md bg-gray-200"}></div>
    } else {
        return (
            <>
                <div className={"my-4 w-80 rounded-md overflow-hidden mx-auto border shadow-md "} dangerouslySetInnerHTML={
                    html
                }/>
            </>
        );
    }
}
