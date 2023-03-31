import * as React from "react"
import { useAddItemGroup } from "../data/stuff/useStuff"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import { Button } from "primereact/button"

const AddGroupForm = (props) => {
  const { data } = props
  const addGroupMutation = useAddItemGroup()

  let { id, group_name, notes } = data
  const group_id = id

  const [responseMessage, setResponseMessage] = React.useState("")
  const [form, setForm] = React.useState({
    id: id,
    group: group_name,
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
    setResponseMessage("")
    let response = ""
    const { group, notes } = form
    addGroupMutation.mutate({ group, notes })
    setForm({ group: "", notes: "" })
  }
  return (
    <div className="mt-5">
      <form onSubmit={handleSubmit}>
        <span className="p-float-label">
          <InputText
            id="group"
            type="text"
            value={form.group}
            onChange={handleChange}
            autocomplete="off"
          />
          <label htmlFor="group">Group Name</label>
        </span>

        <span className="p-float-label mt-4">
          <InputTextarea
            id="notes"
            value={form.notes}
            onChange={handleChange}
            rows={5}
            cols={30}
          />
          <label htmlFor="notes">Notes</label>
        </span>
        <Button label="Save" />
      </form>
      <p>{responseMessage}</p>
    </div>
  )
}

export { AddGroupForm }
