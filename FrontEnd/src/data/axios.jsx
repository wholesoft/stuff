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

const refreshAccessToken = async () => {
  const response = await axiosAuth.get("/refresh", { withCredentials: true })
  console.log("REFRESH AUTH TOKEN: " + JSON.stringify(response.data))
  localStorage.setItem("atoken", response.data.access_token)
  return response.data.access_token
}

axiosAuth.interceptors.request.use(
  (config) => {
    if (!config.headers["Authorization"]) {
      const atoken = localStorage.getItem("atoken")
      console.log(
        "INTERCEPT REQUEST.  ATTACHING AUTHORIZATION ACCESS TOKEN: Bearer " +
          atoken
      )

      config.headers["Authorization"] = `Bearer ${atoken}`
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

axiosAuth.interceptors.response.use(
  (response) => {
    console.log("RESPONSE SUCCEEDED.")
    return response
  },
  async (error) => {
    console.log("Response Auth Error.")
    const originalRequest = error?.config

    console.log(error.message) // Request failed with status code 401
    console.log(error.response.status) // 401

    if (
      (error.response.status == 401 || error.response.status == 403) &&
      !originalRequest.sent
    ) {
      // I THINK THE NORMAL SITUATION IS A 403 ERROR AFTER THE ATOKEN EXPIRES
      console.log("GETTING NEW TOKEN.")
      originalRequest.sent = true

      const newAccessToken = await refreshAccessToken()

      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`
      return axiosAuth(originalRequest)
    }
    return Promise.reject(error)
  }
)

export { axiosAuth }
