import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";

import Layout from '../components/layout'
import Drop from "../components/drop";
import Sortable from "../components/blocks/sortable";
import Block from "../components/blocks/block";
import ProfileImage from "../components/profile/profile-image";
import fetcher from "../helpers/fetcher";
import {server} from "../config";
import ActionBar from "../components/action-bar";

const penIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
    <path
        d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
</svg>;
const bookIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
</svg>

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
    const [authorMode, setAuthorMode] = useState(false)
    const [blocks, setBlocks] = useState([...props.blocks])
    const [shrink, setShrink] = useState(false);
    const [imageSize, setImageSize] = useState('20rem')
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

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.onscroll = () => {
                const offset = window.pageYOffset
                let size
                if (offset <= 50) size = '20rem';
                else if (offset <= 100) size = '15rem';
                else size = '10rem';
                setImageSize(size)
            }
        }
    }, []);
    return (
        <Layout>
            <div className={"w-96 mx-auto"}>
                <div
                    id={"header"}
                    className={`${shrink ? "" : ""} transition-all ease-linear duration-200 w-96 flex flex-col rounded mx-auto p-8`}>
                    <h1 className={`pb-2 text-5xl font-sans font-extrabold`}>
                        {props.name}
                    </h1>
                    <div
                        style={{width: imageSize, height: imageSize}}
                        className={`transition-all ease-linear duration-200 rounded-2xl`}>
                        <ProfileImage src={props.image} colors={props.colors} className={"rounded-2xl"}/>
                    </div>
                    <h2 className={`pt-1`}>@{props.username}</h2>
                    <div
                        className={`pt-8 m-auto`}>{props.bio}</div>
                </div>
                <div>
                    <div className={"border-b w-full mb-4"}></div>
                    {isSelf && authorMode &&
                    <div className={'mx-auto py-4'}>
                        <Drop newBlock={newBlock}/>
                    </div>
                    }
                    <ul className={"w-80 mx-auto"}>
                        {(isSelf && authorMode) ?
                            (<Sortable blocksState={blocks}
                                       setBlocksState={setBlocks}
                                       commitBlockPosition={commitBlockPosition}/>
                            )
                            : blocks.map(block => (
                                <Block
                                    block={block}
                                    key={block.id}
                                    className={"w-full"}
                                    authorMode={authorMode}
                                />))
                        }
                    </ul>
                </div>
            </div>
            {isSelf && <ActionBar
                message={authorMode ? bookIcon : penIcon}
                handleClick={() => setAuthorMode(!authorMode)}/>}
        </Layout>
    )
}
