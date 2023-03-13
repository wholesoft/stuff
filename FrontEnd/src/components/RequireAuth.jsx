import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    console.log("Auth Roles: " + auth.roles);
    console.log("Allowed Roles " + JSON.stringify(allowedRoles));
    //console.log("Includes 1001: " + allowedRoles?.includes(1001));
    return (
            auth?.roles?.find(role => allowedRoles?.includes(role)) 
            ? <Outlet />
            : auth?.email 
            ? <Navigate to="/unauthorized" state={{ from: location }} replace />
            : <Navigate to="/login" state={{ from: location }} replace />        
    );
}

export { RequireAuth }