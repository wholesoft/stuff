import { tabTitle } from "../utils/helperFunctions"
import { useNavigate } from "react-router-dom"
import useLogout from "../hooks/useLogout"

const Logout = () => {
  const navigate = useNavigate()
  const logout = useLogout()

  logout()
  navigate("/")

  return <>{tabTitle("Logout - Wholesoft Stuff")}</>
}

export { Logout }
