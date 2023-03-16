import * as React from 'react';
import useAuth from '../hooks/useAuth';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import axios from "../api/axios";

const LOGIN_URL = '/auth';

const Login = () => {
    const { setAuth, persist, setPersist  } = useAuth();// React.useContext(AuthContext);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = React.useRef();
    const errRef = React.useRef();

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errMsg, setErrMsg] = React.useState('');

    React.useEffect(() => {
        userRef.current.focus();
    }, [])

//    React.useEffect(() => {
 //       setErrMsg('');
 //   }, [email][password]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL, JSON.stringify({email, password}), {
             headers: { 'Content-Type': 'application/json' },
             withCredentials: true   
            });
            console.log(JSON.stringify(response?.data));
            const access_token = response?.data?.access_token;
            const roles = response?.data?.roles;
            const email_confirmed = response?.data?.email_confirmed;
            console.log("email_confirmed: " + email_confirmed);
            if (!email_confirmed)
            {
                setAuth({  }); 
                localStorage.setItem("unconfirmed_email", email);
                setEmail('');
                setPassword('');
                navigate('/unconfirmed'); 
            }
            else
            {
                setAuth({ email: email, roles, access_token });
                setEmail('');
                setPassword('');
                navigate(from, {replace: true });   
            }
        } catch (err) {
            console.log("ERROR FOUND");
            if (!err?.response) {
                setErrMsg("No Server Response");
                console.log("NO RESPONSE");
            } else if (err.response?.status === 400) {
                setErrMsg("Missing Email or Password");
                console.log("MISSING EMAIL OR PASSWORD");
            } else if (err.response?.staus === 401) {
                setErrMsg("Unauthorized");
                console.log("UNAUTHORIZED");
            } else {
                setErrMsg("Login Failed");
                console.log("LOGIN FAILED");
            }
            //errRef.current.focus();
        }
    }

    const togglePersist = () => {
        setPersist(prev => !prev);
    }

    React.useEffect(() => {
        localStorage.setItem("persist", persist);
    },[persist])

    return (
        <section>
    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

<h1>Sign In</h1>
<form onSubmit={handleSubmit}>
    <label htmlFor="email">Email:</label>
    <input type="text" id="username" ref={userRef} autoComplete="off" 
    onChange={(e) => setEmail(e.target.value) }
    value={email} required
    /><br/>
    <label htmlFor="password">Password:</label>
    <input type="password" id="password" 
    onChange={(e) => setPassword(e.target.value) }
    value={password} required
    /><br />
    <p>{errMsg}</p><br />
    <button>Sign In</button>
    <div>
        <input type="checkbox"
        id="persist"
        onChange={togglePersist}
        checked={persist}
        />
        <label htmlFor="persist">Trust this device</label>
    </div>
    <p>
        <NavLink to='/register'>Need an Account?</NavLink><br />
        <span className='line'>
            {/* put router link here */}
            <a href='#'>Sign Up</a>
        </span>
    </p>
</form>
        </section>
    )
}

export { Login }
