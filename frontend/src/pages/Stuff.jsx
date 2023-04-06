import { AddGroupForm } from "../components/AddGroupForm"
import { ItemGroupsTable } from "../components/ItemGroupsTable"
import { tabTitle } from "../utils/helperFunctions"

const Stuff = () => {
  console.log(process.env.NODE_ENV)
  return (
    <>
      {tabTitle("My Stuff - Wholesoft Stuff")}
      <ItemGroupsTable />
      <AddGroupForm data={{}} />
    </>
  )
}

export { Stuff }
