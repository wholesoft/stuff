import { useResource } from '../hooks/useResource'

const UserInfo = ( props ) => {
    const userId = props.userId;
    console.log("User ID: " + userId);
    const user = useResource(`/users/${userId}`);
    console.log (JSON.stringify(user));
    const { email, email_confirmed, created } = user || {};
    return user ? (
        <>
        <h3>{email}</h3>
        <p>ID: { userId }</p>
        <p>Email Confirmed: {email_confirmed}</p>
        <p>Creaetd: { created }</p>
        </>

    ) : <p>Loading...</p>
}

export { UserInfo }