import {useProfile} from "../../helpers/use";
import Link from "next/link";
import React from "react";
import ProfileImage from "./profile-image";

export default function Avatar({userId}) {
    const {profile, isLoading, isError} = useProfile({userId: userId})
    if (isLoading || isError || !profile || !profile.username) return <span/>

    return (
        <Link href={`/${profile.username}`}>
            <a>
                {profile && <>
                    <ProfileImage className={"float-left rounded-lg"}
                                  src={profile.image}
                                  colors={profile.colors}/>
                    {profile.username && <span className={"m-auto text-xs text-gray-500"}>@{profile.username}</span>}
                </>}
            </a>
        </Link>
    )
}
