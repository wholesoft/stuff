import { Link, NavLink } from "react-router-dom"
import { UserInfo } from "../test/UserInfo"
import { tabTitle } from "../utils/helperFunctions"

const ShowUser = () => {
  return (
    <>
      {tabTitle("User Info - Wholesoft Stuff")}
      <UserInfo userId={-1} />
    </>
  )
}

export { ShowUser }
