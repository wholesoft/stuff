import { AddGroupForm } from "../components/AddGroupForm"
import { DisplayGroups } from "../components/DisplayGroups"
import { tabTitle } from "../utils/helperFunctions"
import { Link } from "react-router-dom"

const Stuff = () => {
  return (
    <>
      {tabTitle("My Stuff - Wholesoft Stuff")}
      <span className="text-sm">
        <Link to="/add_group">Add Group</Link>
      </span>
      <DisplayGroups />
      {/* <AddGroupForm data={{}} /> */}
    </>
  )
}

export { Stuff }
