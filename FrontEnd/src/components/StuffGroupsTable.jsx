import React, { useMemo } from 'react'
import { useResourcePrivate } from '../hooks/useResourcePrivate'
import { BasicTable } from './BasicTable'
import { SortTable } from './SortTable'
import { FilterTable } from './FilterTable'
import { Link } from 'react-router-dom';

function formatDate(date_string)
{
    let result = ""
    if (date_string != null)
    {
        result = new Date(date_string).toLocaleDateString() 
    }
    return result;
}

const StuffGroupsTable = () => {
    let tableData = useResourcePrivate(`/stuff_groups`);
    console.log(tableData);

    const COLUMNS = [
        {
            Header: 'Group',
            accessor: 'group_name'
        },
        {
            Header: 'Notes',
            accessor: 'notes'
        }
        ,
        {
            Header: 'Updated',
            accessor: 'updated',
            Cell:  ({ value }) => { return formatDate(value) }
        },
        {
            Header: 'Created',
            accessor: 'created',
            Cell:  ({ value }) => { return formatDate(value) }
        }
        ,
        {
            Header: 'Items',
            accessor: 'id',
            Cell: ({ value }) => { return <Link to={`/stuff/${value}`}>view</Link> }
        },
        {
            Header: 'Edit',
            id: 'edit',
            accessor: 'id',
            Cell:  ({ value }) => { return <Link to={`/edit-group/${value}`} state={{ data: tableData.filter(group => group.id == value) }}>edit</Link> }
        },
        {
            Header: 'Delete',
            id: 'delete',
            accessor: 'id',
            Cell:  ({ value }) => { return <Link to={`/delete-group/${value}`}>delete</Link> }
        }
    
    ]
    


   return tableData ? (
        <>
        <FilterTable data={tableData} columns={COLUMNS} />
        </>
    ) : <p>LOADING...</p>
  }


export {StuffGroupsTable}

