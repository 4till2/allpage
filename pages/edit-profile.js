import React, {useState} from 'react';
import Router from 'next/router';
import {Field, Form, Formik} from 'formik';
import * as Yup from 'yup';
import {getSession, useSession} from "next-auth/react";
import {store} from "../helpers/file";
import Layout from "../components/layout";
import {UsernameField} from "../components/profile/username-field";
import generateColors from "../helpers/generateColor";
import SaveOrCancelButtons from "../components/save-or-cancel-buttons";
import fetcher from "../helpers/fetcher";
import {server} from "../config";


const usernameValidationSchema = Yup.object({
    username: Yup.string()
        .min(3, 'Must be at least 3 characters')
        .max(20, 'Must be less than 20 characters')
        .required('Username is required')
        .test(async (val) => await validateUsername(val))
        .matches(
            /^[a-zA-Z0-9\_]+$/,
            'Cannot contain special characters or spaces'
        ),
})

//fix to only check on change
async function validateUsername(username) {
    const res = await fetcher(`api/utils/validate-username?username=${username}`);

    return res?.result
}


export async function getServerSideProps(context) {
    const session = await getSession(context)

    if (!session) {
        return {
            redirect: {
                destination: '/api/auth/signin',
                permanent: false,
            },
        }
    }

    const profile = await fetcher(`${server}/api/profile/get?profileId=${session.user.profileId}`)
    return {
        props: {...profile}
    }
}


export default function EditProfile(props) {
    const {data: session, status} = useSession()
    const [image, setImage] = useState(props.image);
    const [colors, setColors] = useState(props.colors || generateColors())
    const [imageKey, setImageKey] = useState(undefined)
    const newUser = !props.username;

    const handleUpdate = async (values) => {
        const profile = await fetcher(`/api/profile/update`, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }),
            body: JSON.stringify({
                image: imageKey,
                username: values.username,
                name: values.name,
                colors: colors,
                bio: values.bio
            })
        })
        if (profile) await Router.push(`/${profile.username}`)
        return;
    }

    const saveProfilePhoto = async (event) => {
        const file = event.target.files[0];
        const key = await store(file);
        setImageKey(key)
        setImage(URL.createObjectURL(file))
    }

    const deleteProfilePhoto = async (event) => {
        const confirm = window.confirm("Are you sure you want to delete your profile photo?");
        if (!confirm) return;
        setImageKey('')
        setImage('')
    }

    const handleCancel = () => {
        if (!newUser) {
            Router.push(`/${props.username}`);
            return;
        }
    }
    return (
        <Layout>
            <div className={"m-auto absolute top-0 w-full z-10 bg-gray-50"}>
                <div className={"p-8 w-96 relative m-auto  rounded box-shadow-2xl"}>
                    {newUser &&
                    <div className={"p-4 mb-4  m-auto text-center"}>
                        <h1 className={"text-4xl font-bold"}>Welcome,</h1>
                        <p className={""}>Let's get you all set up!</p>
                    </div>}
                    <div className={"flex flex-wrap w-80 mx-auto"}>
                        <Formik
                            initialValues={{
                                name: props.name,
                                username: props.username || '',
                                image: image,
                                bio: props.bio
                            }}
                            onSubmit={async (values) => {
                                await handleUpdate(values)
                            }}
                            validationSchema={usernameValidationSchema}
                        >
                            <Form>
                                <label htmlFor="name" className={"font-extrabold "}>Full Name</label>
                                <Field id="name" name="name" placeholder="Full Name"
                                       className={"wpb-1 mb-2 pl-3 border-l border-gray-700 text-xl md:text-xl font-sans  w-full focus:outline-none overflow-visible"}/>
                                <div>
                                    <div
                                        style={(image) ?
                                            {backgroundImage: `url(${image})`} :
                                            {background: `linear-gradient(90deg, ${colors[0]} 0%, ${colors[1]} 100%)`}}
                                        className={`relative rounded-tl-none rounded-lg w-full h-80 mb-2 border shadow-md backdrop-blur-3x mt-2 bg-cover`}>
                                        {/*{image && <Image src={image} className={"p-2"}*/}
                                        {/*                 layout={"fill"} objectPosition={"center"}/>}*/}
                                        <label
                                            htmlFor="file-upload"
                                            className="absolute cursor-pointer p-2 m-3 backdrop-blur-lg bg-gray-50/70 border-black border border-b-4 active:border-b-2  active:shadow-sm active:translate-y-0.5 font-bold rounded-md shadow-lg"
                                        >
                                            <span>{image ? 'Replace Image' : 'Upload Image'}</span>
                                            <input id="file-upload"
                                                   name="file-upload"
                                                   type="file"
                                                   onChange={saveProfilePhoto}
                                                   className="sr-only"/>
                                        </label>
                                        {!image &&
                                        <span
                                            className={"absolute cursor-pointer p-2 m-3 right-0 backdrop-blur-lg bg-gray-50/70 border-black border border-b-4 active:border-b-2  active:shadow-sm active:translate-y-0.5  font-bold rounded-md shadow-lg"}
                                            onClick={() => setColors(generateColors())}>Get New Colors</span>
                                        }
                                        {/*TODO: Actually delete image from aws*/}
                                        {image && <span
                                            className={"absolute cursor-pointer p-2 m-3 right-0  bg-gray-50/70 border-black border  border-b-4 rounded-md shadow-lg text-red-600"}
                                            onClick={deleteProfilePhoto}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                                 viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round"
                                                                                                  strokeLinejoin="round"
                                                                                                  strokeWidth={1}
                                                                                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                            </svg>
                                        </span>}

                                    </div>
                                </div>
                                <div className={"my-4"}>
                                    <UsernameField
                                        label="Username"
                                        id="username"
                                        name="username"
                                        helpText="Must be 3-20 characters and cannot contain special characters."
                                        placeholder="username"
                                        type="text"
                                        className={"border-0 focus:ring-0 p-0 pb-1 mb-1 pl-3 border-l"}
                                    />
                                </div>
                                <label htmlFor="bio" className={"font-extrabold "}>Bio</label>
                                <Field id="bio" name="bio" placeholder="Bio" as={"textarea"} rows={"8"}
                                       className={"resize-none mb-2 pl-3 border-r-0 border-y-0 border-gray-700 focus:ring-0 focus:border-gray-700  font-sans  w-full focus:outline-none overflow-visible"}/>
                                <SaveOrCancelButtons onCancel={!newUser ? handleCancel : null} onSave={() => {
                                }}/>
                            </Form>
                        </Formik>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
EditProfile.auth = true
