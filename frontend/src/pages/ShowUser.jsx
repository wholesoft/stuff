import { Link, NavLink } from "react-router-dom";
import  { UserInfo } from '../test/UserInfo';

const ShowUser = () => {
    return (
        <>       
            <UserInfo userId={ -1 } />
        </>
    )
}

export { ShowUser };