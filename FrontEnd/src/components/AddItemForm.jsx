import { useState, useRef } from "react"
import "react-datepicker/dist/react-datepicker.css"
import { useAddItem } from "../data/stuff/useStuff"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import { Card } from "primereact/card"
import { Calendar } from "primereact/calendar"

const AddItemForm = (props) => {
  const { data } = props
  const toastRef = useRef()
  const addMutation = useAddItem(toastRef)

  let {
    id,
    item_name,
    group_id,
    purchased_location,
    date_purchased,
    notes,
    amount_paid,
  } = data
  let item_id = id

  if (group_id == undefined) {
    group_id = props.groupId
  }
  //console.log(group_id);

  if (amount_paid == null) {
    amount_paid = ""
  }

  let init_state = {
    item_id: item_id,
    group_id: group_id,
    item_name: item_name,
    purchase_location: purchased_location,
    amount_paid: amount_paid,
    notes: notes,
  }

  const [purchaseDate, setPurchaseDate] = useState(new Date())
  const [responseMessage, setResponseMessage] = useState("")
  const [form, setForm] = useState(init_state)

  const handleChange = (event) => {
    event.preventDefault()
    setForm({
      ...form,
      [event.target.id]: event.target.value,
    })
  }

  const handleDateChange = (value) => {
    setPurchaseDate(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setResponseMessage("")
    let response = ""
    const { item_name, purchase_location, amount_paid, notes, group_id } = form
    addMutation.mutate({
      item_id,
      group_id,
      item_name,
      purchase_location,
      purchase_date: purchaseDate,
      amount_paid,
      notes,
    })
    setForm(init_state)
    console.log("reset form")
  }

  return (
    <>
      <Card title="Add Item" className="col-12 md:col-6">
        <form onSubmit={handleSubmit}>
          <div className="p-fluid">
            <span className="p-float-label">
              <InputText
                value={form.item_name}
                onChange={handleChange}
                id="item_name"
              />
              <label htmlFor="item_name">Item Name</label>
            </span>
          </div>

          <div className="p-fluid mt-4">
            <span className="p-float-label">
              <InputText
                id="purchase_location"
                value={form.purchase_location}
                onChange={handleChange}
              />
              <label htmlFor="purchase_location">Purchase Location</label>
            </span>
          </div>

          <div className="p-fluid mt-4">
            <span className="p-float-label">
              <Calendar
                id="purchase_date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.value)}
                dateFormat="mm/dd/yy"
              />

              <label htmlFor="purchase_date">Purchase Date</label>
            </span>
          </div>

          <div className="p-fluid mt-4">
            <span className="p-float-label">
              <InputText
                id="amount_paid"
                value={form.amount_paid}
                onChange={handleChange}
              />
              <label htmlFor="amount_paid">Amount Paid</label>
            </span>
          </div>

          <div className="p-fluid mt-4">
            <span className="p-float-label">
              <InputTextarea
                rows={5}
                cols={30}
                id="notes"
                value={form.notes}
                onChange={handleChange}
              />
              <label htmlFor="notes">Notes</label>
            </span>
          </div>
          <Button label="save" />
        </form>
        <p>{responseMessage}</p>
      </Card>
      <Toast ref={toastRef} />
    </>
  )
}

export { AddItemForm }
