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

      <div className="flex align-items-center text-blue-600">
        <Link to="/add_group">
          <i
            className="pi pi-plus-circle p-2 text-blue-600"
            style={{ fontSize: "2.5rem" }}
          ></i>
        </Link>{" "}
        <Link
          to="/add_group"
          className="text-blue-600"
          style={{ textDecoration: "none" }}
        >
          <span>Add Group</span>
        </Link>
      </div>

      <DisplayGroups />
    </>
  )
}

export { Groups }
