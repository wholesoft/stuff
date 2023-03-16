import { useResource } from '../hooks/useResource'
import { useParams } from 'react-router-dom'

const UserInfo = ( props ) => {
    const {id} = useParams();
    console.log("User ID: " + id);
    const user = useResource(`/users/${id}`);
    console.log (JSON.stringify(user));
    const { email, email_confirmed, created, last_login, n_logins, roles } = user || {};
    return user ? (
        <>
        <p>User ID: { id }</p>
        <p>{email}</p>
        <p>Roles: { roles }</p>
        <p>Last Login: { last_login }</p>
        <p>Total Logins: { n_logins }</p>
        <p>Email Confirmed: {email_confirmed}</p>
        <p>Creaetd: { created }</p>
        </>

    ) : <p>Loading...</p>
}

export { UserInfo }