import {SessionProvider, signIn, useSession} from "next-auth/react"
import './styles.css'
import {useEffect} from "react";

export default function App({
                                Component,
                                pageProps: {session, ...pageProps},
                            }) {
    return (
        <SessionProvider session={session}>
            {Component.auth ? (
                <Auth>
                    <Component {...pageProps} />
                </Auth>
            ) : (
                <Component {...pageProps}/>
            )}
        </SessionProvider>
    )
}

function Auth({children}) {
    const {data: session, status} = useSession()
    const isUser = !!session?.user
    useEffect(() => {
        if (status === "loading") return // Do nothing while loading
        if (!isUser) signIn() // If not authenticated, force log in
    }, [isUser, status])

    if (isUser) {
        return children
    }

    // Session is being fetched, or no user.
    // If no user, useEffect() will redirect.
    return <></>
}
