import Link from "next/link";
import React, {useEffect, useState} from "react";
import ProfileImage from "./profile-image";

export default function MiniProfile({profile, index}) {
    const [posY, setPosY] = useState(0)
    const [posX, setPosX] = useState(0)
    const [opacity, setOpacity] = useState(1)
    const updatePosition = () => {
        // if (posX > 100) clearInterval(interval)

    }
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setPosX(posX + 1);
    //     }, 500);
    //     if (posX > 10000000) clearInterval(interval)
    //     return () => clearInterval(interval);
    // });
    return (
        <div className={"ease-linear py-8 "} style={{transition: 'all 1s', transform: `translate(${posX}px, ${posY}px)`, opacity: opacity}}>
        <Link href={`/${profile.username}`} className={"m-auto"}>
            <a
                style={{background: `linear-gradient(90deg, ${profile.colors[0]} 0%, ${profile.colors[1]} 100%)`}}
                id={"header"}
                className={`m-auto transition-all ease-linear duration-200 flex flex-col rounded-xl mx-auto p-4`}>
                <h1 className={`pb-2 text-sm font-sans font-extrabold`}>
                    {profile.name}
                </h1>
                <div
                    className={`w-14 h-14 transition-all ease-linear duration-200 rounded-2xl`}>
                    <ProfileImage src={profile.image} colors={profile.colors} className={"rounded-2xl"}/>
                </div>
                <h2 className={`pt-1 text-xs`}>@{profile.username}</h2>
                {/*<div className={`pt-1 truncate`}>{profile.bio}</div>*/}
            </a>
        </Link>
        </div>
    )
}
