import MenuBar from './menu-bar'

export default function Layout({children}) {
    return (
        <>
            <main className={'mb-24'}>
                {children}
            </main>
            <MenuBar/>
        </>
    )
}
