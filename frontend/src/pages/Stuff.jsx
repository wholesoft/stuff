import { AddGroupForm } from "../components/AddGroupForm"
import { DisplayGroups } from "../components/DisplayGroups"
import { tabTitle } from "../utils/helperFunctions"

const Stuff = () => {
  return (
    <>
      {tabTitle("My Stuff - Wholesoft Stuff")}
      <DisplayGroups />
      <AddGroupForm data={{}} />
    </>
  )
}

export { Stuff }
