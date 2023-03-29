import React, { useMemo, useState } from 'react'
import { Test } from './Test'
import { Link } from 'react-router-dom';
import { useItemGroups, useDeleteItemGroup, useEditItemGroupName, useEditItemGroupNote } from '../data/stuff/useStuff'

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

const ItemGroupsTable = () => {

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })

    const groupQuery = useItemGroups();
    const deleteGroupMutation = useDeleteItemGroup();
    const editGroupNameMutation = useEditItemGroupName()
    const editGroupNoteMutation = useEditItemGroupNote()

    const groupData = groupQuery.data;

    const rowData = groupData;
    const colData = [
        {field: 'group_name', key: 'id', header: "Group"},
        {field: 'notes', key: 'id', header: "Notes"},
    ]

    const actionTemplate = (rowData) => {
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
                    deleteGroupMutation.mutate(rowData.id)
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

      let displayDetails = (rowData) => {
        let id = rowData.id;
        return <Link to={`/stuff/${id}`}>details</Link>
      }

    let size = "small"
    if (groupQuery.isLoading) return <h1>Loading...</h1>
    if (groupQuery.isError) {
        return <pre>{JSON.stringify(groupQuery.error)}</pre>
    }
    return  <>

<InputText
    onInput={(e) => 
        setFilters({
            global: { value: e.target.value, matchMode: FilterMatchMode.CONTAINS },
        })
    } />


<DataTable value={rowData} showGridlines stripedRows size={size} filters={filters} tableStyle={{ minWidth: '50rem' }}>
    {colData.map((col, i) => (
            <Column key={col.field} field={col.field} header={col.header} sortable
            editor={(options) => cellEditor(options)}
            onCellEditComplete={onCellEditComplete}
            />
    ))} 
        <Column field='created' header='Created' sortable body={displayCreated} />
        <Column field='updated' header='Updated' sortable body={displayUpdated} />
        <Column body={actionTemplate} />
        <Column body={displayDetails} />

</DataTable>



        </>
  }


export {ItemGroupsTable}

