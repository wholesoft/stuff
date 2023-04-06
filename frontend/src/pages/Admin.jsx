import { UsersTable2 } from "../components/UsersTable2"
import { UsersTable } from "../components/UsersTable"
import { tabTitle } from "../utils/helperFunctions"

const Admin = () => {
  return (
    <>
      {tabTitle("Admin - Wholesoft Stuff")}
      <h1>Admin Page</h1>
      <br />
      <UsersTable2 />
    </>
  )
}

export { Admin }
