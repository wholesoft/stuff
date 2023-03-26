import * as React from 'react';
import { useAxiosPrivate } from '../hooks/useAxiosPrivate';
import { UpdatePassword } from '../components/UpdatePassword'

const Account = () => {
    const [email, setEmail] = React.useState('');
    const [responseMessage, setResponseMessage] = React.useState('');
    const axiosPrivate = useAxiosPrivate();



    const handleSubmit = async (e) => {
        e.preventDefault();
        setResponseMessage("");
        try {
            const response = await axiosPrivate.post('/update_email_address', JSON.stringify({email}), {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true   
            });
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
            } else if (err.response?.status === 400) {
                setResponseMessage("Missing Email");
                console.log("MISSING EMAIL");
            } else  {
                setResponseMessage("Unauthorized");
                console.log("UNAUTHORIZED");
            }
        }
    }

    return (
        <section>
            <h1>Account Page</h1>
            <br />
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input type="text" id="email" autoComplete="off" className='text-input'
                onChange={(e) => setEmail(e.target.value) }
                value={email} required
                
                /><br/>
                    <button>Update</button>
                </form>
                <p>{responseMessage}</p>
                <hr />
                <UpdatePassword />
        </section>
    )
}

export { Account };