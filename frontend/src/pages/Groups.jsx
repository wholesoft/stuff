import { DisplayGroups } from "../components/DisplayGroups"
import { tabTitle } from "../utils/helperFunctions"
import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { About } from "./About"

const Groups = () => {
  const { auth } = useAuth()

  if (!auth?.roles?.includes(1001)) {
    return (
      <>
        <About />
      </>
    )
  }

  return (
    <>
      {tabTitle("My Stuff - Wholesoft Stuff")}
      <span className="text-sm">
        <Link to="/add_group">Add Group</Link>
      </span>
      <DisplayGroups />
    </>
  )
}

export { Groups }
