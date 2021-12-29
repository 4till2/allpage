import {useState} from "react";


export default function ActionBar(props) {
    const {message, handleClick} = props;
    return(
        <div
            className={`fixed right-6 overflow-hidden bottom-8 text-center bg-gray-700 text-gray-50 rounded-full p-2 shadow-4xl border-b-2 active:border-b-1  active:shadow-sm active:translate-y-0.5 border-gray-700`}>
            <div className={"text-left cursor-pointer"}  onClick={handleClick}>
                {message}
            </div>
        </div>
    )
}
