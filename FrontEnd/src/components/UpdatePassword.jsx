import * as React from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const UpdatePassword = () => {
    const [password, setPassword] = React.useState('');
    const [confirm_password, setConfirmPassword] = React.useState('');
    const [responseMessage, setResponseMessage] = React.useState('');
    const axiosPrivate = useAxiosPrivate();



    const handleSubmit = async (e) => {
        e.preventDefault();
        setResponseMessage("");
        try {
            const response = await axiosPrivate.post('/update_password', JSON.stringify({password, confirm_password}), {
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