import {SessionProvider, signIn, useSession} from "next-auth/react"
import './styles.css'
import {useEffect} from "react";

export default function App({
                                Component,
                                pageProps: {session, ...pageProps},
                            }) {
    return (
        <SessionProvider session={session}
                         options={{
                             // Client Max Age controls how often the useSession in the client should
                             // contact the server to sync the session state. Value in seconds.
                             // e.g.
                             // * 0  - Disabled (always use cache value)
                             // * 60 - Sync session state with server if it's older than 60 seconds
                             clientMaxAge: 0,
                             // Keep Alive tells windows / tabs that are signed in to keep sending
                             // a keep alive request (which extends the current session expiry) to
                             // prevent sessions in open windows from expiring. Value in seconds.
                             //
                             // Note: If a session has expired when keep alive is triggered, all open
                             // windows / tabs will be updated to reflect the user is signed out.
                             keepAlive: 0
                         }}>
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
