import { DisplayItems } from "../components/DisplayItems"
import { AddNewItem } from "../components/AddNewItem"
import { useParams, Link } from "react-router-dom"
import { useGroup } from "../data/stuff/useStuff"
import { tabTitle } from "../utils/helperFunctions"

const Items = (props) => {
  const { group_id } = useParams()
  const groupQuery = useGroup(group_id)
  const rowData = groupQuery.data

  if (groupQuery.isLoading) return <h1>Loading...</h1>
  if (groupQuery.isError) {
    return <pre>{JSON.stringify(groupQuery.error)}</pre>
  }
  return (
    <>
      {tabTitle("Items - Wholesoft Stuff")}
      <div className="flex align-items-center">
        <span>Group:</span>
        <h2 className="pl-2 text-blue-700">{rowData[0].group_name}</h2>
      </div>
      {/* <p>{rowData[0].notes}</p> */}

      {/*       <Link to={`/add_item/${group_id}`} style={{ textDecoration: "none" }}>
        <div className="flex align-items-center">
          <i
            className="pi pi-plus-circle p-2"
            style={{ fontSize: "2.0rem", color: "blue" }}
          ></i>
        </div>
      </Link> */}

      <AddNewItem groupId={group_id} />

      <DisplayItems groupId={group_id} />

      {/* <AddEditItemForm data={{}} /> */}
    </>
  )
}

export { Items }
