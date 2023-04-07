import React, { useState } from "react"
import { AddItemImage } from "./AddItemImage.jsx"

import {
  useItems,
  useDeleteItem,
  useEditItemName,
  useEditItemNote,
  useEditItemPurchasedLocation,
  useEditItemPurchasedDate,
  useEditItemCost,
} from "../data/stuff/useStuff"

import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { FilterMatchMode, PrimeIcons } from "primereact/api"
import { InputText } from "primereact/inputtext"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { parseISO, format } from "date-fns"

function formatDate(date_string) {
  let result = ""
  if (date_string != null) {
    result = new Date(date_string).toLocaleDateString()
  }
  return result
}

const ItemsTable = (props) => {
  const group_id = props.groupId

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })

  const itemsQuery = useItems(group_id)
  const deleteItemMutation = useDeleteItem()
  const editItemNameMutation = useEditItemName()
  const editItemNoteMutation = useEditItemNote()
  const editItemPurchasedLocationMutation = useEditItemPurchasedLocation()
  const editItemPurchasedDateMutation = useEditItemPurchasedDate()
  const editItemCostMutation = useEditItemCost()
  const rowData = itemsQuery.data
  //console.log(rowData)

  const deleteTemplate = (rowData) => {
    return (
      <div className="deleteAction">
        <span className="actionIcons delete-role">
          <i
            id="link_delete"
            className={PrimeIcons.TRASH}
            title={"delete"}
            aria-hidden="true"
            onClick={(e) => {
              //console.log(`DELETE ACTION ${rowData.id}`);
              deleteItemMutation.mutate(rowData.id)
            }}
          />
        </span>
      </div>
    )
  }

  const onCellEditChange = (options) => (event) => {
    options.editorCallback(event.target.value)
  }

  const onDateCellEditChange = (options) => (newDate) => {
    //console.log("DATE CHANGED")
    //console.log(newDate) // Tue Feb 28 2023 00:00:00 GMT-0700 (Mountain Standard Time)
    options.editorCallback(newDate) // opens edit box rather than just saving.
  }

  const cellEditor = (options) => {
    return (
      <InputText value={options.value} onChange={onCellEditChange(options)} />
    )
  }

  function isIsoDate(str) {
    // Really just looking for this format: "2023-03-30T07:00:00.000Z"
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false
    const d = new Date(str)
    return d instanceof Date && !isNaN(d) && d.toISOString() === str // valid date
  }

  const dateCellEditor = (options) => {
    //console.log(options)
    //console.log(`Edit: ${options.value}`)
    let thisDate = options.value
    if (isIsoDate(thisDate)) {
      thisDate = parseISO(thisDate) // works when receives something like "2023-03-30T07:00:00.000Z"
    }
    //console.log(`parseISO: ${thisDate}`) // "Invalid Date"
    return (
      <DatePicker
        selected={thisDate}
        dateFormat="yyyy-MM-dd"
        onChange={onDateCellEditChange(options)}
      />
    )
  }
  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e
    let item_id = rowData["id"]
    console.log(`EDIT CELL (${field}) COMPLETE: ${newValue}, ID: ${item_id}`)
    if (field == "item_name") {
      editItemNameMutation.mutate({ item_id: item_id, item_name: newValue })
    }
    if (field == "notes") {
      editItemNoteMutation.mutate({ item_id: item_id, note: newValue })
    }
    if (field == "purchased_location") {
      editItemPurchasedLocationMutation.mutate({
        item_id: item_id,
        purchased_location: newValue,
      })
    }
    if (field == "date_purchased") {
      editItemPurchasedDateMutation.mutate({
        item_id: item_id,
        purchase_date: newValue,
      })
    }
    if (field == "amount_paid") {
      editItemCostMutation.mutate({ item_id: item_id, amount_paid: newValue })
    }
  }

  let totalSpent = (rowsData) => {
    let total = 0
    let a = rowsData.map((row) => {
      if (row.amount_paid != "" && row.amount_paid != null) {
        total += parseFloat(row.amount_paid)
      }
    })
    return total
  }

  let displayUpdated = (rowData) => {
    let value = rowData.updated
    return formatDate(value)
  }

  let displayCreated = (rowData) => {
    let value = rowData.created
    return formatDate(value)
  }

  let displayDatePurchased = (rowData) => {
    let value = rowData.date_purchased
    return formatDate(value)
  }

  let displayImage = (rowData) => {
    let value = rowData.image
    let item_id = rowData.id
    let result = <AddItemImage item_id={item_id} />
    if (value != "" && value != null) {
      result = (
        <img
          style={{ maxWidth: "200px", maxHeight: "200px" }}
          src={`http://localhost:3000/images/${value}`}
          alt=""
        />
      )
    }
    return result
  }

  let size = "small"
  if (itemsQuery.isLoading) return <h1>Loading...</h1>
  if (itemsQuery.isError) {
    return <pre>{JSON.stringify(itemsQuery.error)}</pre>
  }
  return (
    <>
      <p>
        <b>Total Spent</b> ${totalSpent(rowData)}
      </p>
      <InputText
        placeholder="Search"
        onInput={(e) =>
          setFilters({
            global: {
              value: e.target.value,
              matchMode: FilterMatchMode.CONTAINS,
            },
          })
        }
      />
      <DataTable
        value={rowData}
        showGridlines
        stripedRows
        size={size}
        filters={filters}
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column key="id" field="id" header="ID" sortable />
        <Column
          field="item_name"
          header="Item"
          sortable
          editor={(options) => cellEditor(options)}
          onCellEditComplete={onCellEditComplete}
        />
        <Column
          field="notes"
          header="Note"
          sortable
          editor={(options) => cellEditor(options)}
          onCellEditComplete={onCellEditComplete}
        />
        <Column
          field="purchased_location"
          header="Purchase Location"
          sortable
          editor={(options) => cellEditor(options)}
          onCellEditComplete={onCellEditComplete}
        />
        <Column
          field="date_purchased"
          header="Purchase Date"
          sortable
          body={displayDatePurchased}
          editor={(options) => dateCellEditor(options)}
          onCellEditComplete={onCellEditComplete}
        />
        <Column
          field="amount_paid"
          header="Cost"
          sortable
          editor={(options) => cellEditor(options)}
          onCellEditComplete={onCellEditComplete}
        />
        <Column field="image" header="Image" body={displayImage} />
        {/*
        <Column field='created' header='Created' sortable body={displayCreated} />
        <Column field='updated' header='Updated' sortable body={displayUpdated} />
        */}
        <Column body={deleteTemplate} />
      </DataTable>
    </>
  )
}

export { ItemsTable }
