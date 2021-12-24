import React from "react";
import Link from 'next/link'
import {createUrl, parseUrl} from "../../helpers/url";

export default function DefaultEmbed({href, title, className}) {
    if (!href && !title) return <></>
    const url = parseUrl(createUrl(href) || '')

    return (
        <Link href={href}>
            <a target={"_blank"}
               className={`${className} rounded-tl-none text-ellipsis overflow-hidden block text-center p-4 w-full rounded-xl  font-bold  shadow-lg backdrop-blur-lg bg-gray-50/70 border-black border border-b-4 active:border-b-2 active:shadow-sm active:translate-y-0.5 hover:bg-gray-700 active:bg-gray-700 active:text-gray-50`}
            >{title || (url && url.authority)}</a>
        </Link>
    )
}
