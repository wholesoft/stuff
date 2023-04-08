import { DisplayItems } from "../components/DisplayItems"
import { AddItemForm } from "../components/AddItemForm"
import { useParams } from "react-router-dom"
import { useGroup } from "../data/stuff/useStuff"
import { tabTitle } from "../utils/helperFunctions"

const StuffGroup = (props) => {
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
      <h1>{rowData[0].group_name}</h1>
      <DisplayItems groupId={group_id} />

      <AddItemForm data={{}} groupId={group_id} />
    </>
  )
}

export { StuffGroup }
