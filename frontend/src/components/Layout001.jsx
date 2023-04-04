import { Outlet } from "react-router-dom"
import useAuth from '../hooks/useAuth'

const Layout = () => {
    const { auth } = useAuth();

    return (
        <div className='wrapper'>
        <div className='logo'><a href='/'>Stuff</a></div>
        <div className='login'>{ auth?.email 
        ? <a href='/account'>{auth.email}</a>
        : <a href='/login/'>login</a>
        }</div>
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