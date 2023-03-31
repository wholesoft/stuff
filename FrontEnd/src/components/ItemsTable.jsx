import React, { useMemo, useState } from "react"
import { Test } from "./Test"
import { Link } from "react-router-dom"
import {
  useItems,
  useDeleteItem,
  useEditItemGroupName,
  useEditItemGroupNote,
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

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css"

//core
import "primereact/resources/primereact.min.css"

//icons
import "primeicons/primeicons.css"

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
  //const editGroupNameMutation = useEditItemGroupName()
  //const editGroupNoteMutation = useEditItemGroupNote()
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

  const onDateCellEditChange = (options) => (event) => {
    console.log(event)
    options.editorCallback(event)
  }

  const cellEditor = (options) => {
    return (
      <InputText value={options.value} onChange={onCellEditChange(options)} />
    )
  }
  const dateCellEditor = (options) => {
    console.log(`Edit: ${options.value}`)
    const thisDate = parseISO(options.value) // formatDate(options.value)
    console.log(thisDate)
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

  let size = "small"
  if (itemsQuery.isLoading) return <h1>Loading...</h1>
  if (itemsQuery.isError) {
    return <pre>{JSON.stringify(itemsQuery.error)}</pre>
  }
  return (
    <>
      <InputText
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
        {/* <Column key='id' field='id' header='ID' sortable/> */}
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
