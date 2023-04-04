import { Link } from "react-router-dom"

const LinkPage = () => {
    return (
        <section>
            <h1>Links</h1>
            <br />
            <h2>Public</h2>
            <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            </ul>
            <br />
            <h2>Private</h2>
            <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/stuff">Stuff</Link></li>
            <li><Link to="/admin">Admin Page</Link></li>
            </ul>
        </section>
    )
}

export { LinkPage }