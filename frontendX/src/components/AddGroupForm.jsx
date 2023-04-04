import { useState, useRef } from "react"
import { useAddItemGroup } from "../data/stuff/useStuff"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import { Card } from "primereact/card"

const AddGroupForm = () => {
  const toastRef = useRef()
  const addGroupMutation = useAddItemGroup(toastRef)

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
    addGroupMutation.mutate({ group, notes })
    setForm({ group: "", notes: "" })
  }
  return (
    <>
      <Card title="Add Group" className="col-12 md:col-6">
        <form onSubmit={handleSubmit}>
          <div className="p-fluid">
            <span className="p-float-label">
              <InputText
                id="group"
                type="text"
                value={form.group}
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

export { AddGroupForm }
