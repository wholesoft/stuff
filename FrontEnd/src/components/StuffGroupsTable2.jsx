import React, { useMemo } from 'react'
import { useResourcePrivate } from '../hooks/useResourcePrivate'
import { BasicTable } from './BasicTable'
import { SortTable } from './SortTable'
import { FilterTable } from './FilterTable'
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getItemGroups } from '../api/stuff'

function formatDate(date_string)
{
    let result = ""
    if (date_string != null)
    {
        result = new Date(date_string).toLocaleDateString() 
    }
    return result;
}

const GROUP_DATA = [{
    id: 1,
    group_name: 'test_group'
}]

const StuffGroupsTable2 = () => {
    //let tableData = useResourcePrivate(`/stuff_groups`);
    //console.log(tableData);
    const queryClient = useQueryClient()

    const groupQuery = useQuery({
        queryKey: ["item_groups"],
        queryFn: () => getItemGroups() 
        /* [...GROUP_DATA] */
    })

    const newGroupMutation = useMutation({
        mutationFn: group_name => {
            GROUP_DATA.push({id: crypto.randomUUID(), group_name})
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["item_groups"])
        },
    })

    if (groupQuery.isLoading) return <h1>Loading...</h1>
    if (groupQuery.isError) {
        return <pre>{JSON.stringify(groupQuery.error)}</pre>
    }

    return <div>
        <h1>Stuff Query</h1>
        { JSON.stringify(groupQuery.data) }
        <br />
        <button 
        disabled={newGroupMutation.isLoading}
        onClick={() => newGroupMutation.mutate("NEW GROUP") }>Add New</button>
        </div>
}
/*
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
*/

export {StuffGroupsTable2}

