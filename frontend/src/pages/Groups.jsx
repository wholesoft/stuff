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

      <Link to="/add_group" style={{ textDecoration: "none" }}>
        <div className="flex align-items-center text-blue-800">
          <i
            className="pi pi-plus-circle p-2"
            style={{ fontSize: "2.0rem" }}
          ></i>
        </div>
      </Link>

      <DisplayGroups />
    </>
  )
}

export { Groups }
