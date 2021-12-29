import {signIn, signOut, useSession} from "next-auth/react"
import React, {useState} from "react";
import Avatar from "./profile/avatar";
import Link from "next/link";

export default function MenuBar() {
    const {data: session, status} = useSession()
    const loading = status === 'loading'
    const [isOpen, setIsOpen] = useState(false);
    if (loading) return <></>

    const toggleSidebar = (e) => {
        setIsOpen(!isOpen)
    }
    let barIcon = isOpen ? "M4 6h16M4 12h16M4 18h16" : "M4 6h16M4 12h16M4 18h8"

    return (
        <div>
            <div
                className={`${isOpen ? 'shadow-lg backdrop-blur-lg z-10' : ''} fixed left-4 overflow-hidden bottom-8 text-center
                h-auto transition-all`}>
                <div
                    className={`${isOpen ? "ml-0" : "-ml-32"}  rounded-lg rounded-b-none w-32 p-2 transition-all`}>
                    <div className={"w-full text-left"}>
                        <LoggedIn session={session}/>
                        <LoggedOut session={session}/>
                    </div>
                </div>
                <div
                    className={`${isOpen ? 'rounded-t-none' : ''} bg-gray-700 rounded-tl-none text-gray-50 rounded-lg p-2 shadow-4xl `}>
                    <div className={"text-left cursor-pointer"} onClick={toggleSidebar}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24 "
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                  d={barIcon}/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}

const LoggedIn = ({session}) => {
    if (!session) return <></>
    const isLoggedIn = !!session?.user
    const handleSignOut = (e) => {
        e.preventDefault()
        let confirm = window.confirm("Sign Out?");
        confirm && signOut()
    }
    return (
        <>
            <div className={"w-10 h-10 mb-8 rounded-full bg-gray"}>
                {session.user.id && <Avatar userId={session.user.id}/>}
            </div>
            <div className={"my-3"}>
                <Link href={"/edit-profile"}><a
                    className={"hover:text-black hover:underline  font-bold"}>Edit
                    Profile</a></Link>
            </div>
            <a
                href={`/api/auth/signout`}
                className={"hover:text-black text-xs text-gray-500"}
                onClick={handleSignOut}
            >
                Sign out
            </a>
        </>
    )
}

const LoggedOut = ({session}) => {
    if (!!session) return <></>
    return (
        <>
            <a
                href={`/api/auth/signin`}
                className={"hover:text-black  hover:underline  font-bold"}
                onClick={(e) => {
                    e.preventDefault()
                    signIn()
                }}
            >
                Sign in / up
            </a>
        </>
    )
}
