import axios from "../api/axios"
import useAuth from "./useAuth"

const useLogout = () => {
  const { setAuth } = useAuth()

  const logout = async () => {
    setAuth({})
    try {
      localStorage.clear()
      const response = await axios("/logout", {
        withCredentials: true,
      })
    } catch (err) {
      console.error(err)
    }
  }
  return logout
}

export default useLogout
