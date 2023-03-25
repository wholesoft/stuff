import axios from 'axios';
const BASE_URL = 'http://localhost:3000';

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

export const authApi = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

/*
const refresh = async () => {
    const response = await axios.get('/refresh', {
        withCredentials: true
    });
    setAuth(prev => {
        console.log("SET AUTH WITH: " + JSON.stringify(response.data));
        return { ...prev, email: response.data.email, roles: response.data.roles,
            access_token: response.data.access_token }
    });
    return response.data.access_token;
}
*/

export const refreshAccessTokenFn = async () => {
    //const response = await authApi.get(); // <ILoginResponse>('auth/refresh');
    const response = await authApi.get('/refresh', { withCredentials: true });
    console.log("REFRESH AUTH TOKEN: " + JSON.stringify(response.data));
    /*
    {"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozMCwicm9sZXMiOlsxMDAxLDIwMDFdLCJpYXQiOjE2Nzk3NzQyMjQsImV4cCI6MTY3OTc3NDIzOX0.Z_DNbERLbC-YVbbIyhKH0x9WNL3hW8WwpMY_z-H3tBM",
    "email":"erikthompson@yandex.com",
    "roles":[1001,2001]}
    */
    // response.data.access_token

    //return response.data;
    return response.data.access_token;
  };
  
  authApi.interceptors.response.use(
    (response) => {
        console.log("interceptor fired");
      return response;
    },
    async (error) => {
      // We get a 401 error when a valid JWT token is needed
      console.log("interceptor error");
      console.log(error.message); // Request failed with status code 401
      console.log(error.response.status); // 401
      const originalRequest = error.config;
      //const errMessage = error.response.data.message; //undefine? // as string

      //console.log(errMessage);
      if (error.response.status == 401 && !originalRequest._retry) {
        console.log("Request refresh token.");
        originalRequest._retry = true;
        //await refreshAccessTokenFn();
        const newAccessToken = await refreshAccessTokenFn()
        //const newAccessToken = await refresh();
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return authApi(originalRequest);
      }
      return Promise.reject(error);
    }
  );
  
  export const signUpUserFn = async (props) => {  // (user: RegisterInput)
    const response = await authApi.post(); // <GenericResponse>('auth/register', user);
    return response.data;
  };
  
  export const loginUserFn = async (props) => {  // user: RegisterInput
    const response = await authApi.post(); // <ILoginResponse>('auth/login', user);
    return response.data;
  };
  
  export const verifyEmailFn = async (props) => { // verificationCode: string
    const response = await authApi.get() // <GenericResponse>(`auth/verifyemail/${verificationCode}`);
    return response.data;
  };
  
  export const logoutUserFn = async () => {
    const response = await authApi.get(); // <GenericResponse>('auth/logout');
    return response.data;
  };
  
  export const getMeFn = async () => {
    const response = await authApi.get(); // <IUserResponse>('users/me');
    return response.data;
  };