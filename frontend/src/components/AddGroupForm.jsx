import { useState, useRef, useEffect } from "react"
import { useAddGroup, useEditGroup } from "../data/stuff/useStuff"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import { Card } from "primereact/card"
import { useNavigate } from "react-router-dom"
import { useGroup } from "../data/stuff/useStuff"

const AddGroupForm = (props) => {
  const toastRef = useRef()
  const addGroupMutation = useAddGroup(toastRef)
  const editGroupMutation = useEditGroup(toastRef)
  const group_id = props.groupId

  const groupQuery = useGroup(group_id)

  let rowData = { group_name: "", notes: "" }

  let cardTitle = "Add Group"
  if (group_id > 0) {
    cardTitle = "Edit Group"
  }

  const [form, setForm] = useState({
    group: "",
    notes: "",
  })

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.id]: event.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let response = ""
    const { group, notes } = form
    if (group_id > 0) {
      editGroupMutation.mutate({ group_id, group, notes })
    } else {
      addGroupMutation.mutate({ group, notes })
    }
    setForm({ group: "", notes: "" })
  }

  if (groupQuery.isLoading) return <h1>Loading...</h1>
  if (groupQuery.isError) {
    return <pre>{JSON.stringify(groupQuery.error)}</pre>
  }

  if (group_id > 0) {
    rowData = groupQuery.data[0]
  }
  // console.log(rowData)

  return (
    <>
      {JSON.stringify(rowData)}
      <Card title={cardTitle} className="col-12 md:col-6">
        <form onSubmit={handleSubmit}>
          <div className="p-fluid">
            <span className="p-float-label">
              <InputText
                id="group"
                type="text"
                defaultValue={form.group}
                onChange={(e) => handleChange(e)}
                autoComplete="off"
              />
              <label htmlFor="group">Group Name</label>
            </span>

            <span className="p-float-label mt-4">
              <InputTextarea
                id="notes"
                defaultValue={form.notes}
                onChange={(e) => handleChange(e)}
                rows={5}
                cols={30}
              />
              <label htmlFor="notes">Notes</label>
            </span>
          </div>
          <Button icon="pi pi-check" label="Save" />
        </form>
      </Card>
      <Toast ref={toastRef} />
    </>
  )
}

export { AddGroupForm }
