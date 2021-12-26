import React, {useRef, useState} from "react";
import DefaultEmbed from "../embeds/default-embed";
import * as Yup from 'yup';
import Modal from "../modal";
import {createUrl} from "../../helpers/url";
import {useSession} from "next-auth/react";
import post from "../../helpers/post";
import SaveOrCancelButtons from "../save-or-cancel-buttons";

const validationSchema = Yup.object({
    title: Yup.string()
        .min(3, 'Must be at least 3 characters')
        .max(20, 'Must be less than 20 characters')
        .matches(
            /^[a-zA-Z0-9]+$/,
            'Cannot contain special characters or spaces'
        ),
})

function EditBlock({block, updateBlock, isEditing, setIsEditing}) {
    const [values, setValues] = useState({title: block.title, href: block.url.href})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState({})

    const titleInput = useRef(null);
    const hrefInput = useRef(null);

    const deleteBlock = async () => {
        setLoading(true)
        await post('block/delete', {id: block.id})
            .then(res => {
                if (res.success) {
                    updateBlock(null)
                    setIsEditing(false)
                }
            })
        setLoading(false)
    }

    const saveBlock = async () => {
        setLoading(true)
        let validUrl = createUrl(values.href)
        if (!validUrl) {
            setError(Object.assign({}, error, {href: "Invalid Url"}))
            setLoading(false)
            return
        }
        await post('block/update', {id: block.id, ...values})
            .then(res => {
                if (res.content) {
                    updateBlock(res.content)
                    setIsEditing(false)
                }
            })
        setLoading(false)
    }

    const resetState = () => {
        setValues({title: block.title, href: block.url.href})
        setError(null)
        titleInput.current.value = block.title || ''
        hrefInput.current.value = block.url.href || ''
    }

    const handleSubmit = async (e) => {
        await saveBlock()
    }

    const handleCancel = () => {
        resetState()
        setIsEditing(false)
    }

    const handleChange = async (e) => {
        let clone = Object.assign({}, values, {[e.target.id]: e.target.value});
        setValues(clone)
    }
    const handleDelete = async (e) => {
        let confirm = window.confirm("Are you sure you want to delete this entry permanently?")
        confirm ? await deleteBlock() : null
    }

    return (
        <div className={"inline-flex"}>
            <div
                className={"cursor-pointer m-auto -mr-8"}
                onClick={() => setIsEditing(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300 hover:"
                     fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                </svg>
            </div>
            <Modal
                onExit={() => setIsEditing(false)}
                isOpen={isEditing}
            >
                <div className={"grid gap-4 content-between text-ellipsis overflow-hidden"}>

                <span onClick={handleDelete}
                      className={'text-red-700 cursor-pointer hover:text-red-900'}>
                    Delete
                </span>
                    <div className={"w-full flex space-between items-center"}>
                        <div>
                            <label htmlFor="title">Title</label>
                            <input id="title" name="title"
                                   ref={titleInput}
                                   className={"focus:ring-0 border-0 pb-1 p-0 mb-2 pl-3 border-l-2 focus:border-gray-700 border-gray-700 text-lg font-sans font-extrabold w-full focus:outline-none"}
                                   type={'text'}
                                   value={values.title}
                                   placeholder={'Title'}
                                   onChange={handleChange}
                                   onFocus={() => setIsEditing(true)}
                                   disabled={loading}

                            />
                        </div>
                        <div>
                            <label htmlFor="href">Url</label>
                            {error && error.href && <span className={"text-pink-600 float-right"}>{error.href}</span>}
                            <input id="href" name="href"
                                   className={"focus:ring-0 border-0 focus:border-gray-700 pb-1 p-0 mb-2 pl-3 border-l-2 border-gray-700 text-lg font-sans font-extrabold w-full focus:outline-none"}
                                   type={'text'}
                                   ref={hrefInput}
                                   value={values.href}
                                   placeholder={'Url'}
                                   onChange={handleChange}
                                   onFocus={() => setIsEditing(true)}
                                   disabled={loading}
                            />
                        </div>
                    </div>
                    <DefaultEmbed href={values.href} title={values.title}/>
                    <SaveOrCancelButtons onSave={handleSubmit} onCancel={handleCancel}/>
                </div>
            </Modal>
        </div>
    )
}

export default function Block(props) {
    const {data: session, status} = useSession()
    const [block, setBlock] = useState(props.block)
    const [isEditing, setIsEditing] = useState(false)
    if (!block) return <></>

    const updateBlock = (values) => {
        setBlock(values)
    }

    return (
        <li className={`${props.className} inline-flex`} ref={props.innerRef}>
            {!isEditing &&
            <div className={"inline-flex rounded-xl w-full hover:text-gray-50  my-4 grow"}>
                <DefaultEmbed href={block.url.href} title={block.title}/>
            </div>
            }
            {session && session.user.profileId == block.profileId &&
            <EditBlock block={block} updateBlock={updateBlock} isEditing={isEditing}
                       setIsEditing={setIsEditing}/>
            }
        </li>
    )
}
