import {useField} from "formik";
import React from "react";

export const UsernameField = ({label, helpText, ...props}) => {
    const [field, meta] = useField(props);

    // Show inline feedback if EITHER
    // - the input is focused AND value is longer than 2 characters
    // - or, the has been visited (touched === true)
    const [didFocus, setDidFocus] = React.useState(false);
    const handleFocus = () => setDidFocus(true);
    const showFeedback =
        (!!didFocus && field.value.trim().length > 2) || meta.touched;

    return (
        <div
            className={`form-control ${
                showFeedback ? (meta.error ? 'invalid' : 'valid') : ''
            }`}
        >
            <div className={"flex items-center justify-between"}>
                <label htmlFor={props.id} className={"font-extrabold "}>{label}</label>{' '}
            </div>
            <input
                {...props}
                {...field}
                aria-describedby={`${props.id}-feedback ${props.id}-help`}
                onFocus={handleFocus}

            />
            {showFeedback ? (
                <div
                    id={`${props.id}-feedback`}
                    aria-live="polite"
                    className="feedback text-sm"
                >
                    {meta.error ? <span className={"text-red-700"}>{meta.error}</span> : <span className={"text-green-700"}>Available!</span>}
                </div>
            ) : null}
            {didFocus && <div className="text-xs" id={`${props.id}-help`} tabIndex="-1">
                {helpText}
            </div>}
        </div>
    );
};
