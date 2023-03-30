import { useState, useRef } from 'react';
import { useAxiosPrivate } from '../hooks/useAxiosPrivate';
import { UpdatePassword } from '../components/UpdatePassword'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import useAuth from '../hooks/useAuth'


const Account = () => {
    const { auth } = useAuth();
    const [email, setEmail] = useState(auth.email);
    const toastRef = useRef();
    const axiosPrivate = useAxiosPrivate();



    const handleSubmit = async (e) => {
        e.preventDefault();        
        try {
            const response = await axiosPrivate.post('/update_email_address', JSON.stringify({email}), {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true   
            });
            console.log(JSON.stringify(response?.data));
            const message = response?.data?.message;
            const success = response?.data?.success;
            toastRef.current.show({severity: 'info', summary: success, detail: message})
            //navigate(from, {replace: true });   
            } catch (err) {
            console.log("ERROR FOUND");
            console.log(err.message);
            if (!err?.response) {
                toastRef.current.show({severity: 'info', summary: "Error", detail: "No Server Response."})
                console.log("NO RESPONSE");
            } else if (err.response?.status === 400) {
                toastRef.current.show({severity: 'info', summary: "Error", detail: "Missing Email."})
                console.log("MISSING EMAIL");
            } else  {
                toastRef.current.show({severity: 'info', summary: "Error", detail: "Unauthorized."})
                console.log("UNAUTHORIZED");
            }
        }
    }

    return (
        <section>
            <h1>Account Page</h1>
            <br />
            <form onSubmit={handleSubmit}>
            <div className="p-fluid">
                <div className="p-field">
                    <label htmlFor="email">Email:</label>
                    <InputText value={email} onChange={(e) => setEmail(e.target.value) }/>
                </div>

            </div>
            <Button label="Update" icon="pi pi-check" />
            <Toast ref={toastRef} />
            </form> 
                
               {/*
                <br />
                <input type="text" id="email" autoComplete="off" className='text-input'
                onChange={(e) => setEmail(e.target.value) }
                value={email} required />
    
                <br/>
                    <button>Update</button>
                    */}


                <hr />
                <UpdatePassword />
        </section>
    )
}

export { Account };