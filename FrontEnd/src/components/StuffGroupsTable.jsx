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

const COLUMNS = [
    {
        Header: 'ID',
        accessor: 'id',
        Cell: ({ value }) => { return <Link to={`/stuff/${value}`}>{value}</Link> }
    },
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

]



const StuffGroupsTable = () => {
    let tableData = useResourcePrivate(`/stuff_groups`);
    console.log(tableData);

   return tableData ? (
        <>
        <FilterTable data={tableData} columns={COLUMNS} />
        </>
    ) : <p>LOADING...</p>
  }


export {StuffGroupsTable}

