import { Link, NavLink } from "react-router-dom";
import  { UsersTable } from '../components/UsersTable';

const Admin = () => {
    return (
        <section>
            <h1>Admin Page</h1>
            <br />
            <UsersTable />
        </section>
    )
}

export { Admin };