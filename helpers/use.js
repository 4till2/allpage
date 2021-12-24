import useSWR from 'swr'
import {server} from "../config";
import fetcher from "./fetcher";
import {useSession} from "next-auth/react";

export function useUser(id) {
    const {data, error} = useSWR(`${server}/api/user/get/?id=${id}`, fetcher)
    return {
        user: data,
        isLoading: !error && !data,
        isError: error
    }
}

export function useProfile({userId, profileId}) {
    const {session} = useSession()
    const key = profileId ? 'profileId' : 'userId'
    let val = profileId || userId
    const {data, error} = useSWR(`${server}/api/profile/get/?${key}=${val}`, fetcher)
    return {
        profile: data,
        isLoading: !error && !data,
        isError: error
    }
}
