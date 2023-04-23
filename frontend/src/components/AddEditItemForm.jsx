import { useState, useRef, useEffect } from "react"
import { useAddItem, useEditItem, useDeleteItem } from "../data/stuff/useStuff"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import { Card } from "primereact/card"
import { Calendar } from "primereact/calendar"
import { Checkbox } from "primereact/checkbox"
import { AddItemImage } from "./AddItemImage"

function setDatePickerValue(date_string) {
  // PrimeReact Calendar control's value needs to be set with a Date Object.
  // or an empty string if we want no value.
  let result = ""
  if (date_string != null) {
    result = new Date(date_string)
  }
  return result
}

const AddEditItemForm = (props) => {
  const toastRef = useRef()
  const addItemMutation = useAddItem(toastRef)
  const editItemMutation = useEditItem(toastRef)
  let group_id = props.groupId
  const deleteItemMutation = useDeleteItem(toastRef, group_id)
  const [purchaseDate, setPurchaseDate] = useState(props.data?.date_purchased)
  const [responseMessage, setResponseMessage] = useState("")
  const [deleteCheck, setDeleteCheck] = useState(false)
  const [itemId, setItemId] = useState(0)

  let data = props.data
  console.log(data)

  let amount_paid = ""
  let notes = ""
  let item_name = ""
  let purchase_location = ""
  let image = ""

  //console.log("amount paid")
  //console.log(props.data)
  if (props.data != undefined) {
    if (props.data.amount_paid != null) {
      amount_paid = props.data.amount_paid
    }
    if (props.data.notes != null) {
      notes = props.data.notes
    }
    if (props.data.item_name != null) {
      item_name = props.data.item_name
    }
    if (props.data.image != null) {
      image = props.data.image
    }
    if (props.data.purchased_location != null) {
      purchase_location = props.data.purchased_location
    }
  }

  let init_state = {
    group_id: props.groupId,
    item_name: item_name,
    purchase_location: purchase_location,
    amount_paid: amount_paid,
    notes: notes,
    image: image,
  }

  const [form, setForm] = useState(init_state)

  const handleChange = (event) => {
    event.preventDefault()
    setForm({
      ...form,
      [event.target.id]: event.target.value,
    })
  }

  //console.log(props.data)
  //let id = 0
  if (props.data != undefined && itemId == 0) {
    setItemId(props.data.id)
  }
  let cardTitle = "Add Item"

  if (itemId > 0) {
    cardTitle = "Edit Item"
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let response = ""
    console.log(form)
    const { group_id, item_name, purchase_location, amount_paid, notes } = form
    if (itemId > 0) {
      if (deleteCheck) {
        deleteItemMutation.mutate(itemId)
      } else {
        editItemMutation.mutate({
          item_id: itemId,
          group_id,
          item_name,
          purchase_location,
          purchase_date: purchaseDate,
          amount_paid,
          notes,
        })
      }
    } else {
      addItemMutation.mutate({
        group_id,
        item_name,
        purchase_location,
        purchase_date: purchaseDate,
        amount_paid,
        notes,
      })
    }
  }

  return (
    <>
      <Card title={cardTitle} className="col-12 md:col-6">
        <AddItemImage
          item_id={itemId}
          setItemId={setItemId}
          group_id={Number(group_id)}
          image={form.image}
        />

        <form onSubmit={handleSubmit} className="pt-5">
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
                value={setDatePickerValue(purchaseDate)}
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
            {/*
            <div className="mt-2">
              <Checkbox
                inputId="deleteGroup"
                onChange={(e) => setDeleteCheck(e.checked)}
                checked={deleteCheck}
              ></Checkbox>
              <label htmlFor="deleteGroup" className="ml-2">
                Delete Item
              </label>
            </div>
  */}
          </div>
          <Button className="mt-3" icon="pi pi-check" label="Save" />
        </form>
        <p>{responseMessage}</p>
      </Card>
      <Toast ref={toastRef} />
    </>
  )
}

export { AddEditItemForm }
