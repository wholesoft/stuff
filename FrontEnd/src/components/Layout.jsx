import { Outlet } from "react-router-dom"

const Layout = () => {
    return (
        <>
        { /* ADD HEADER */ }
        <main className='App'>
            <Outlet />
        </main>
        </>
    )
}

export { Layout }