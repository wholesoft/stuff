import React, { useMemo } from 'react'
import { Test } from './Test'
import { Link } from 'react-router-dom';
import { useItemGroups, useDeleteItemGroup } from '../data/stuff/useStuff'
import { AgGridReact } from 'ag-grid-react'

//import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-grid.css';
//import 'ag-grid-community/styles/ag-theme-alpine.css';

function formatDate(date_string)
{
    let result = ""
    if (date_string != null)
    {
        result = new Date(date_string).toLocaleDateString() 
    }
    return result;
}

const StuffGroupsTable3 = () => {
    const groupQuery = useItemGroups();
    const deleteGroupMutation = useDeleteItemGroup();
    //const groupQuery = useGroups[0];
    //const deleteGroupMutation = useGroups[1];

    const groupData = groupQuery.data;

    const rowData = groupData;
    const colDefs = [
        {headerName: "ID", field: 'id', resizable: true,},
        {field: 'group_name'},
        {field: 'notes'},
    ]

    const defaultColDef = useMemo( () => ({
        sortable: true, 
        resizable: true
    }), []);

   /*
            accessor: 'group_name'
            accessor: 'notes'
            accessor: 'updated',
            accessor: 'created',
            Cell: ({ value }) => { return <Link to={`/stuff/${value}`}>view</Link> }
            Cell:  ({ value }) => { return <Link to={`/edit-group/${value}`} state={{ data: groupData.filter(group => group.id == value) }}>edit</Link> }
            Cell:  ({ value }) => { return <button
            disabled={ deleteGroupMutation.isLoading }
            onClick={() => deleteGroupMutation.mutate(value) }>Delete
    */
     
    if (groupQuery.isLoading) return <h1>Loading...</h1>
    if (groupQuery.isError) {
        return <pre>{JSON.stringify(groupQuery.error)}</pre>
    }
    return  <>
        <h1>Stuff Query</h1>
        {/* JSON.stringify(groupData) */ }
        <br />
        <div className='ag-theme-alpine' style={{height: 300}}>
        <AgGridReact
            rowData={rowData}
            columnDefs={colDefs} 
            />       
        </div>

        </>
  }


export {StuffGroupsTable3}

