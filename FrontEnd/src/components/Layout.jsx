import { Outlet } from "react-router-dom"

const Layout = () => {
    return (
        <div className='wrapper'>
        <div className='logo'><a href='/'>Stuff</a></div>
        <div className='login'><span><a href='/login/'>login</a></span></div>
        <article className='content'>
            <Outlet />
        </article>
        <aside className='side'>SIDE 1</aside>
        <aside className='side2'>SIDE 2</aside>
        <footer className='main-footer'><a href='/'>Stuff</a></footer>
        </div>
    )
}

export { Layout }