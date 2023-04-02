import axios from "axios"

const BASE_URL = "http://localhost:3000"

export default axios.create({
  baseURL: BASE_URL,
})

const axiosAuth = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})

const refreshAccessTokenFn = async () => {
  //const response = await authApi.get(); // <ILoginResponse>('auth/refresh');
  const response = await axiosAuth.get("/refresh", { withCredentials: true })
  console.log("REFRESH AUTH TOKEN: " + JSON.stringify(response.data))
  /*
    {"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozMCwicm9sZXMiOlsxMDAxLDIwMDFdLCJpYXQiOjE2Nzk3NzQyMjQsImV4cCI6MTY3OTc3NDIzOX0.Z_DNbERLbC-YVbbIyhKH0x9WNL3hW8WwpMY_z-H3tBM",
    "email":"erikthompson@yandex.com",
    "roles":[1001,2001]}
    */
  // response.data.access_token

  //return response.data;
  localStorage.setItem("atoken", response.data.access_token)
  return response.data.access_token
}

axiosAuth.interceptors.request.use(
  (config) => {
    if (!config.headers["Authorization"]) {
      const atoken = localStorage.getItem("atoken")
      console.log("Access Token: " + atoken)
      config.headers["Authorization"] = `Bearer ${atoken}`
    }
    return config
  },
  (error) => {
    //console.log("Request Auth Error.");
    Promise.reject(error)
  }
)

axiosAuth.interceptors.response.use(
  (response) => {
    //console.log("interceptor fired");
    return response
  },
  async (error) => {
    // We get a 401 error when a valid JWT token is needed
    console.log("interceptor error")
    console.log(error.message) // Request failed with status code 401
    console.log(error.response.status) // 401
    const originalRequest = error.config
    //const errMessage = error.response.data.message; //undefine? // as string

    //console.log(errMessage);
    if (
      (error.response.status == 401 || error.response.statue == 403) &&
      !originalRequest._retry
    ) {
      console.log("Request refresh token.")
      originalRequest._retry = true
      //await refreshAccessTokenFn();
      const newAccessToken = await refreshAccessTokenFn()
      //const newAccessToken = await refresh();
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`
      return axiosAuth(originalRequest)
    }
    return Promise.reject(error)
  }
)

export { axiosAuth }
