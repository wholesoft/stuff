import { AddGroupForm } from "../components/AddGroupForm"
import { GroupsTable } from "../components/GroupsTable"
import { tabTitle } from "../utils/helperFunctions"

const Stuff = () => {
  return (
    <>
      {tabTitle("My Stuff - Wholesoft Stuff")}
      <GroupsTable />
      <AddGroupForm data={{}} />
    </>
  )
}

export { Stuff }
