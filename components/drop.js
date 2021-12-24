import {useRef, useState} from "react";
import {createUrl} from '/helpers/url'


export default function Drop(props) {
    const [isActive, setIsActive] = useState(false)
    const [loading, setLoading] = useState(false)
    const [value, setValue] = useState('')
    const [error, setError] = useState('')
    const textInput = useRef(null);

    const submit = async () => {
        setLoading(true)
        let validUrl = createUrl(value)
        if (validUrl) {
            await fetch(`api/block/create?url=${validUrl}`)
                .then(async res => {
                    let json = await res.json()
                    if (res.ok && json.content) props.newBlock(json.content)
                    textInput.current.blur();
                    textInput.current.value = ''
                    setIsActive(false)
                    setValue('')
                })
        } else {
            setError('Invalid Url')
        }
        setLoading(false)
    }

    const handleActive = (val = !isActive) => {
        if (val === false) {
            if (value) return
            setError('')
            setIsActive(false)
            return
        }
        setIsActive(val)
    }
    const handleChange = async (e) => {
        let val = e.target.value
        if (error) setError('')
        if (val && !isActive) handleActive(true)
        if (!val) handleActive(false)
        setValue(val)
    }

    const handleEnter = async (e) => {
        if (e.key === "Enter") {
            await submit()
        }
    }

    return (
        <div className={`${isActive ? 'w-full' : 'w-80'} transition-all rounded mx-auto`}>
            <div className={"w-full flex space-between items-center"}>
                <input
                    className={"mx-auto focus:ring-0 border-0 border-l-2 border-gray-400 focus:border-gray-700 focus:border-l-2 text-xl grow"}
                    ref={textInput}
                    type={'text'}
                    placeholder={'Drop a link here!'}
                    onKeyPress={handleEnter}
                    onChange={handleChange}
                    onFocus={() => handleActive(true)}
                    onBlur={() => handleActive(false)}
                    disabled={loading}
                />
                {(!!isActive || !!value) &&
                <button
                    className={"px-2 py-0 h-8 text-green-700 rounded backdrop-blur-lg bg-gray-50/70 border-black border border-b-4 active:border-b-2  active:shadow-sm active:translate-y-0.5  font-bold rounded-md shadow-lg"}
                    onClick={submit}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                </button>
                }
            </div>
            {error &&
            <div className={"text-pink-600"}>{error}</div>
            }
        </div>
    );
}
