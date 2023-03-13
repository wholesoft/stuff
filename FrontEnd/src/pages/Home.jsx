import { useNavigate, Link, NavLink } from "react-router-dom";
import useLogout from "../hooks/useLogout";
const Home = () => {
    const navigate = useNavigate();
    const logout = useLogout();    
    
    const signOut = async () => {
      await logout();
      navigate('/linkpage');
    }

    return (
      <div>
        <h1>Home</h1>
        <br />
        <p>You are logged in!</p>
        <br />
        <nav>
          <ul>
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/register">Register</NavLink></li>
          <li><NavLink to="/login">Login</NavLink></li>
          <li><NavLink to="/stuff">Stuff</NavLink></li>
          <li><NavLink to="/admin">Admin</NavLink></li>
          <li><button onClick={signOut}>Sign Out</button></li>
          </ul>
         </nav>
      </div>
    )
  }

  export { Home };