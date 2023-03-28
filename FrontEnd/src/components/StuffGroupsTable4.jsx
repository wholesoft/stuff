import React, { useMemo, useState } from 'react'
import { Test } from './Test'
import { Link } from 'react-router-dom';
import { useItemGroups, useDeleteItemGroup } from '../data/stuff/useStuff'

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

const StuffGroupsTable4 = () => {

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })

    const groupQuery = useItemGroups();
    const deleteGroupMutation = useDeleteItemGroup();
    
    const groupData = groupQuery.data;

    const rowData = groupData;
    const colData = [
        {field: 'id', key: 'id', header: "ID"},
        {field: 'group_name', key: 'id', header: "Group"},
        {field: 'notes', key: 'id', header: "Notes"},
        {field: 'created', key: 'id', header: "Created"},
        {field: 'updated', key: 'id', header: "Updated"},
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
                    console.log(`DELETE ACTION ${rowData.id}`);
                    deleteGroupMutation.mutate(rowData.id)
                }}
              />
            </span>
          </div>
        );
      };
    


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
            <Column key={col.field} field={col.field} header={col.header} sortable />
    ))}
        <Column body={actionTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>

</DataTable>



        </>
  }


export {StuffGroupsTable4}

