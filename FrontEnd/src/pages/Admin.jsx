import { Link } from "react-router-dom";
import  { Users } from '../components/Users';

const Admin = () => {
    return (
        <section>
            <h1>Admin Page</h1>
            <br />
            <Users />
            <div className="flexGrow">
                <Link to="/Home">Home</Link>
            </div>
        </section>
    )
}

export { Admin };