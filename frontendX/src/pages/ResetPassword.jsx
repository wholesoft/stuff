import * as React from 'react';
import { UpdatePassword } from '../components/UpdatePassword'
import { useSearchParams } from "react-router-dom";


const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const password_reset_token = searchParams.get("id")
    //const password_reset_token = "XYZ";
    console.log(password_reset_token);

    return (
        <section>
            <h1>Create a new password.</h1>
            <br />
            <UpdatePassword token={password_reset_token} />
        </section>
    )
}

export { ResetPassword };