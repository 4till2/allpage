import React from "react";

export default function SaveOrCancelButtons({onSave, onCancel}) {
    return (
        <div className={"flex justify-between w-full mt-4"}>
            {onCancel && <div
                className={'p-3 border-1 px-8 border rounded-lg cursor-pointer hover:text-red-700 backdrop-blur-lg bg-gray-50/70 border-black border border-b-4 active:border-b-2  active:shadow-sm active:translate-y-0.5  font-bold rounded-md shadow-lg'}
                onClick={onCancel}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </div>}

            {onSave && <button type="submit" onClick={onSave}
                               className={'p-3 border-1 px-8 border rounded-lg  hover:text-green-700 backdrop-blur-lg bg-gray-50/70 border-black border border-b-4 active:border-b-2  active:shadow-sm active:translate-y-0.5  font-bold rounded-md shadow-lg'}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
            </button>
            }
        </div>
    )
}
