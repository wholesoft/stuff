import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    console.log("WTF");
    const { setAuth } = useAuth();

    const refresh = async () => {
        console.log("Received Refresh Call");
        const response = await axios.get('/refresh', {
            withCredentials: true
        });
        setAuth(prev => {
            console.log("WTF2");
            console.log(JSON.stringify(response.data));
            console.log(response.data.access_token);
            return { ...prev, roles: response.data.roles,
                access_token: response.data.access_token }
        });
        return response.data.access_token;
    }
    return refresh;
};

export default useRefreshToken;