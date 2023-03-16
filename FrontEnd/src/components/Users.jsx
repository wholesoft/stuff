import * as React from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { UserInfo } from './UserInfo';

const Users = () => {

    const [users, setUsers] = React.useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const effectRan = React.useRef(false);
    
    React.useEffect(() => {
        if (effectRan.current === false)
        {
            console.log("use effect");
            let isMounted = true;
            const controller = new AbortController();

            const getUsers = async () => {
                try {
                    console.log("AXIOS GET");
                    const response = await axiosPrivate.get('/users', {
                        signal: controller.signal
                    });
                    console.log(response.data);
                    isMounted && setUsers(response.data); 
                    if (isMounted)
                    {
                        setUsers(response.data);
                        isMounted = false;
                        controller.abort();
                    }

                } catch (err) {
                    console.log("Get Users Error.");
                    console.error(err);
                    navigate('/login', { state: { from: location }, replace: true }); 
                }
            }
            getUsers();

            // cleanup function
            return () => {
                //isMounted = false;
                //controller.abort();
                effectRan.current = true;  
            }
        }
    },[])

    return (
      <article>
        <h2>Users Lists</h2>
        { users?.length
         ? (
            <ul>
                {users.map((user, i) => <li key={user.id}><NavLink to={"/user/" + user.id}>{user.email}</NavLink></li> /* <UserInfo userId={user.id} key={user.id} /> */)}
            </ul>
          ) : <p>No users to display</p>
        }
        
        <br />
      </article>
    )
  }

  export { Users };