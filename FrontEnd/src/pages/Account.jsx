import * as React from 'react';
import axios from "../api/axios";


const Account = () => {
    const [email, setEmail] = React.useState('');
    const [errMsg, setErrMsg] = React.useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/update_user_email', JSON.stringify({email}), {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true   
            });
            console.log(JSON.stringify(response?.data));
            const message = response?.data?.message;
            navigate(from, {replace: true });   
            } catch (err) {
            console.log("ERROR FOUND");
            if (!err?.response) {
                setErrMsg("No Server Response");
                console.log("NO RESPONSE");
            } else if (err.response?.status === 400) {
                setErrMsg("Missing Email");
                console.log("MISSING EMAIL");
            } else  {
                setErrMsg("Unauthorized");
                console.log("UNAUTHORIZED");
            }
        }
    }

    return (
        <section>
            <p>{errMsg}</p>
            <h1>Account Page</h1>
            <br />
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input type="text" id="username" autoComplete="off" 
                onChange={(e) => setEmail(e.target.value) }
                value={email} required
                /><br/>
                    <button>Update</button>
                </form>
        </section>
    )
}

export { Account };