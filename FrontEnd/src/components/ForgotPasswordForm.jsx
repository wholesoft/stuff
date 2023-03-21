import * as React from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const ForgotPasswordForm = () => {
    const axiosPrivate = useAxiosPrivate();

    const [responseMessage, setResponseMessage] = React.useState('');
    const [form, setForm] = React.useState({
        email: ''
      });
    
      const handleChange = (event) => {
        setForm({
          ...form,
          [event.target.id]: event.target.value,
        });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setResponseMessage("");
        try {
            const { email } = form;
            const response = await axiosPrivate.post('/reset_password_email_request', JSON.stringify({email}), {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true   
            });
            console.log(JSON.stringify(response?.data));
            const message = response?.data?.message;
            setResponseMessage(message);
            setForm({email: ''});
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


          
      };

  return (
    <div>
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="group">Email</label><br />
        <input
          style ={{'width': '300px'}}
          id="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
    <p>{responseMessage}</p>
    </div>
  );
};

export { ForgotPasswordForm };