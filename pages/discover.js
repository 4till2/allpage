import fetcher from "../helpers/fetcher";
import {server} from "../config";
import React from "react";
import {retrieve} from "../helpers/file";
import Link from 'next/link'
import Layout from "../components/layout";
import MiniProfile from "../components/profile/mini";
import {signIn} from "next-auth/react";

export async function getServerSideProps({params}) {
    const profiles = await fetcher(`${server}/api/profile/getMany`)
    for (let i = 0; i < profiles.length; i++) {
        profiles[i].image = profiles[i].image ? await retrieve(profiles[i].image) : ''
    }
    return {
        props: {profiles: profiles}
    }
}

export default function Discover(props) {
    return (
        <Layout>
            <div
                className={"p-8 overflow-hidden transition-all"}>
                <div
                    className={"m-auto inline-flex p-8 text-center text-5xl font-bold z-10 backdrop-blur-sm bg-gray-700/10 rounded-lg transition-all"}>
                    <Link href={'/allpage'}>
                        <a>
                            <div className={"underline font-extrabold"}>AllPage</div>
                            <div className={"text-sm font-thin"}>By you for you.</div>
                        </a>
                    </Link>
                    <h1 className={"p-1 text-center text-xl"}>Discover</h1>

                </div>
                {/*<a*/}
                {/*    href={`/api/auth/signin`}*/}
                {/*    className={"m-auto hover:text-black  hover:underline  font-bold inline-flex py-4 text-center text-xl font-bold z-10 backdrop-blur-sm rounded-lg transition-all"}*/}
                {/*    onClick={(e) => { e.preventDefault(); signIn()}}*/}
                {/*    >*/}
                {/*    Sign in / up*/}
                {/*</a>*/}
                <div className="grid overflow-scroll">

                    {props.profiles.map((profile, index) =>
                        <MiniProfile key={index}
                                     profile={profile}
                                     index={index}/>
                    )}
                </div>
            </div>
        </Layout>
    )
}
