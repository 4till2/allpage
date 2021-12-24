import React, {useState} from "react";
import {useSession} from "next-auth/react";

import Layout from '../components/layout'
import Drop from "../components/drop";
import Sortable from "../components/blocks/sortable";
import Block from "../components/blocks/block";
import ProfileImage from "../components/profile/profile-image";
import fetcher from "../helpers/fetcher";
import {server} from "../config";

const hydrateBlock = async (block) => {
    return await fetch(`http://localhost:8061/iframely?url=${encodeURIComponent(block.url.url)}`).then(res => res.json());
}

async function hydrateBlocks(blocks) {
    const asyncRes = await Promise.all(blocks.map(async (block) => {
        const hydratedBlock = await hydrateBlock(block);
        return hydratedBlock
    }));
    return asyncRes
}

export async function getServerSideProps({params}) {
    const profile = await fetcher(`${server}/api/profile/get?username=${params.username}`)
    if (!profile || !profile.username) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    return {
        props: {...profile}
    }
}

export default function User(props) {
    const {data: session, status} = useSession()
    const loading = status === 'loading'
    const isSelf = !loading && session && session.user.id == props.userId
    const [blocks, setBlocks] = useState([...props.blocks])

    const newBlock = (new_block) => {
        setBlocks([new_block, ...blocks])
    }
    const commitBlockPosition = async (blockId, position) => {
        await fetch(`/api/block/update`, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }),
            body: JSON.stringify({
                id: blockId,
                position: position
            })
        })
    };
    return (
        <Layout>
            <div className={"w-96 mx-auto"}>

                <div className={"w-96 rounded mx-auto mt-8 p-8"}>
                    <h1 className={"pb-2 text-3xl md:text-5xl font-sans font-extrabold"}>
                        {props.name}
                    </h1>
                    <div className={'h-80 rounded-2xl '}>
                        <ProfileImage src={props.image} colors={props.colors} className={"rounded-2xl"}/>
                    </div>
                    <h2 className={'pt-1 '}>@{props.username}</h2>
                    <div className={"pt-8 text-left m-auto "}>{props.bio}</div>

                </div>
                <div className={"border-b w-full mb-4"}></div>
                {isSelf &&
                <div className={'mx-auto py-4'}>
                    <Drop newBlock={newBlock}/>
                </div>
                }
                <ul className={"w-80 mx-auto"}>
                    {isSelf ?
                        (<Sortable blocksState={blocks}
                                   setBlocksState={setBlocks}
                                   commitBlockPosition={commitBlockPosition}/>
                        )
                        : blocks.map(block => (
                            <Block
                                block={block}
                                key={block.id}
                                className={"w-full"}
                            />))
                    }
                </ul>
            </div>
        </Layout>
    )
}
