import { useResource } from '../hooks/useResource'
import { useParams } from 'react-router-dom'

const UserInfo = ( props ) => {
    const {id} = useParams();
    console.log("User ID: " + id);
    const user = useResource(`/users/${id}`);
    console.log (JSON.stringify(user));
    const { email, email_confirmed, created, last_login, n_logins, roles } = user || {};
    const last_login_local = new Date(last_login).toLocaleString();
    const created_local = new Date(created).toLocaleDateString();
    const email_confirmed_local = new Date(email_confirmed).toLocaleDateString();
    return user ? (
        <>
        <p>User ID: { id }</p>
        <p>{email}</p>
        <p>Roles: { roles }</p>
        <p>Last Login: { last_login_local }</p>
        <p>Total Logins: { n_logins }</p>
        <p>Email Confirmed: {email_confirmed_local}</p>
        <p>Creaetd: { created_local }</p>
        </>

    ) : <p>Loading...</p>
}

export { UserInfo }