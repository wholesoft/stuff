import { useState, useRef, useEffect } from "react"
import { useAddGroup, useEditGroup } from "../data/stuff/useStuff"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import { Card } from "primereact/card"
import { useNavigate } from "react-router-dom"

const AddEditGroupForm = (props) => {
  const toastRef = useRef()
  const addGroupMutation = useAddGroup(toastRef)
  const editGroupMutation = useEditGroup(toastRef)
  //console.log(props.data)
  const { id, group_name, notes } = props.data

  let cardTitle = "Add Group"
  if (id > 0) {
    cardTitle = "Edit Group"
  }

  const [form, setForm] = useState({
    group_name: group_name,
    notes: notes,
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
    const { group_name, notes } = form
    if (id > 0) {
      editGroupMutation.mutate({ group_id: id, group_name, notes })
    } else {
      addGroupMutation.mutate({ group_name, notes })
    }
    //setForm({ group: "", notes: "" })
  }

  return (
    <>
      <Card title={cardTitle} className="col-12 md:col-6">
        <form onSubmit={handleSubmit}>
          <div className="p-fluid">
            <span className="p-float-label">
              <InputText
                id="group_name"
                type="text"
                value={form.group_name}
                onChange={(e) => handleChange(e)}
                autoComplete="off"
              />
              <label htmlFor="group">Group Name</label>
            </span>

            <span className="p-float-label mt-4">
              <InputTextarea
                id="notes"
                value={form.notes}
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

export { AddEditGroupForm }
