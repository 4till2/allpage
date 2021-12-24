import React from "react";
import Link from 'next/link'
import {createUrl, parseUrl} from "../../helpers/url";

export default function DefaultEmbed({href, title, className}) {
    if (!href && !title) return <></>
    const url = parseUrl(createUrl(href) || '')

    return (
        <Link href={href}>
            <a target={"_blank"}
               className={`${className} rounded-tl-none border-b-4 text-ellipsis overflow-hidden block text-center p-4 w-full rounded-xl border-gray-700 border-1 border shadow-sm
               font-bold  text-lg transition-all hover:scale-95  hover:bg-gray-700 hover:text-gray-50 cursor-pointer`}
            >{title || (url && url.authority)}</a>
        </Link>
    )
}
