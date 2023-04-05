import { AddGroupForm } from "../components/AddGroupForm"
import { ItemGroupsTable } from "../components/ItemGroupsTable"

const Stuff = () => {
  console.log(process.env.NODE_ENV)
  return (
    <div>
      <ItemGroupsTable />
      <AddGroupForm data={{}} />
    </div>
  )
}

export { Stuff }
