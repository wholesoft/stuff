import React, { useMemo, useState } from 'react'
import { Test } from './Test'
import { Link } from 'react-router-dom';
import { useItems, useDeleteItem, useEditItemGroupName, useEditItemGroupNote } from '../data/stuff/useStuff'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode, PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
        

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";     
    
//core
import "primereact/resources/primereact.min.css";

//icons
import "primeicons/primeicons.css"; 

function formatDate(date_string)
{
    let result = ""
    if (date_string != null)
    {
        result = new Date(date_string).toLocaleDateString() 
    }
    return result;
}

const ItemsTable = (props) => {

    const group_id = props.groupId;

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })

    const itemsQuery = useItems(group_id);
    const deleteItemMutation = useDeleteItem();
    const editGroupNameMutation = useEditItemGroupName()
    const editGroupNoteMutation = useEditItemGroupNote()

    const rowData = itemsQuery.data;

    const colData = [
        {field: 'id', key: 'id', header: "ID"},
        {field: 'group_name', key: 'id', header: "Group"},
        {field: 'notes', key: 'id', header: "Notes"},
    ]

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
        );
      };

      const onCellEditChange = (options) => (event) => {
        options.editorCallback(event.target.value);
      };
      const cellEditor = (options) => {
        return (
          <InputText
            value={options.value}
            onChange={onCellEditChange(options)}
          />
        );
      };
      const onCellEditComplete = (e) => {
        let { rowData, newValue, field, originalEvent: event } = e;
        let group_id = rowData['id'];
        console.log(`EDIT CELL (${field}) COMPLETE: ${newValue}, ID: ${group_id}`)
        if (field == "group_name") {
            editGroupNameMutation.mutate({'group_id': group_id, 'group_name': newValue})
        }
        if (field == "notes") {
            editGroupNoteMutation.mutate({'group_id': group_id, 'note': newValue})
        }
      };      
    
      let displayUpdated = (rowData) => {  
        let value = rowData.updated;
        return formatDate(value);
      }

      let displayCreated = (rowData) => {
        let value = rowData.created;
        return formatDate(value);
      }

      let displayDatePurchased = (rowData) => {
        let value = rowData.date_purchased;
        return formatDate(value);
      }

    let size = "small"
    if (itemsQuery.isLoading) return <h1>Loading...</h1>
    if (itemsQuery.isError) {
        return <pre>{JSON.stringify(itemsQuery.error)}</pre>
    }
    return  <>

<InputText
    onInput={(e) => 
        setFilters({
            global: { value: e.target.value, matchMode: FilterMatchMode.CONTAINS },
        })
    } />


<DataTable value={rowData} showGridlines stripedRows size={size} filters={filters} tableStyle={{ minWidth: '50rem' }}>
        <Column key='id' field='id' header='ID' sortable/>
        <Column field='item_name' header='Item' sortable/>
        <Column field='notes' header='Note' sortable/>
        <Column field='purchased_location' header='Purchase Location' sortable/>
        <Column field='date_purchased' header='Purchase Date' sortable body={displayDatePurchased} />
        <Column field='amount_paid' header='Cost' sortable/>
        { /*
        <Column field='created' header='Created' sortable body={displayCreated} />
        <Column field='updated' header='Updated' sortable body={displayUpdated} />
        */ }
        <Column body={deleteTemplate} />


</DataTable>



        </>
  }


export {ItemsTable}

