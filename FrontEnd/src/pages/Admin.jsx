import { Link, NavLink } from "react-router-dom";
import  { Users } from '../components/Users';

const Admin = () => {
    return (
        <section>
            <h1>Admin Page</h1>
            <br />
            <Users />
            <div className="flexGrow">
                <NavLink to="/">Home</NavLink>
            </div>
        </section>
    )
}

export { Admin };