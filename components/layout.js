import MenuBar from './menu-bar'

export default function Layout({children}) {
    return (
        <>
            <MenuBar/>
            <main className={'mb-24'}>
                {children}
            </main>
        </>
    )
}
