import * as React from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import axios from '../api/axios';

/*

This form used by both the User Account page and the Password Reset page.
The Account page requires that the user is logged in and passes the JWT token to the backend.
The Password reset page doesn't require that they are logged in (they forgot the password and 
so are unable to do so) but they need a password_reset_token that was emailed to them.
*/

const UpdatePassword = (props) => {
    const [password, setPassword] = React.useState('');
    const [confirm_password, setConfirmPassword] = React.useState('');
    const [responseMessage, setResponseMessage] = React.useState('');
    const axiosPrivate = useAxiosPrivate();
    let password_reset_token = "";
    if (props.token !== undefined) {
        password_reset_token = props.token;
    }
    console.log(password_reset_token);
 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResponseMessage("");
        try {
            let response = ""
            if (password_reset_token == "") {
                response = await axiosPrivate.post('/update_password', 
                JSON.stringify({password, confirm_password}), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true   
                })
            } else {
                response = await axiosPrivate.post('/update_password_with_token', 
                JSON.stringify({password_reset_token, password, confirm_password}), {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true     
                })  
            }
            console.log(JSON.stringify(response?.data));
            const message = response?.data?.message;
            setResponseMessage(message);
            //navigate(from, {replace: true });   
            } catch (err) {
            console.log("ERROR FOUND");
            console.log(err.message);
            if (!err?.response) {
                setResponseMessage("No Server Response");
                console.log("NO RESPONSE");
            } else  {
                setResponseMessage("Unauthorized");
                console.log("UNAUTHORIZED");
            }
        }
    }

    return (
             <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="password">Password:</label><br />
                <input type="password" id="password" autoComplete="off" className='text-input'
                onChange={(e) => setPassword(e.target.value) }
                value={password} required
                /><br/>

                <label htmlFor="confirm_password">Confirm Password:</label><br />
                <input type="password" id="confirm_password" autoComplete="off" className='text-input'
                onChange={(e) => setConfirmPassword(e.target.value) }
                value={confirm_password} required
                /><br/>

                    <button>Update</button>
                </form>
                <p>{responseMessage}</p>
                </>
    )
}

export { UpdatePassword };