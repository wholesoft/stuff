import { Link, NavLink } from "react-router-dom";
import  { UserInfo } from '../components/UserInfo';

const ShowUser = () => {
    return (
        <>        
            <UserInfo userId={ 30 } />
        </>
    )
}

export { ShowUser };