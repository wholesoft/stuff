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

const StuffGroupTable = (props) => {

    function handleDelete(e, value) {
        console.log (value);
        e.preventDefault();
        // Invalid hook call. Hooks can only be called inside of the body of a function component.
        // TODO.  Figure out the best way to do this sort of thing.
        deleteData = useResourcePrivate(`/delete-item/${value}`)
    };


    //const { mounted, setMounted } =  React.useState(false);
    const group_id = props.groupId

    //React.useEffect(() => {
    //    setMounted = true;
    //}, [])

    let COLUMNS = null
    let itemsData = []
    //if (mounted) {
        itemsData = (useResourcePrivate(`/stuff/${group_id}`));

        if (itemsData !== null)
        {
        console.log(itemsData);
    //}

    // itemsData.filter(item => item.id == value)
    COLUMNS = [
        {
            Header: 'ID',
            accessor: 'id',
            Cell: ({ value }) => { return <Link to={`/edit-stuff/${value}`} state={{ data: itemsData.filter(item => item.id == value) }}>{value}</Link> }
        },
        {
            Header: 'Item',
            accessor: 'item_name'
        },
        {
            Header: 'Notes',
            accessor: 'notes'
        }
        ,    
        {
            Header: 'Purchase Location',
            accessor: 'purchased_location'
        }
        ,
        {
            Header: 'Purchase Date',
            accessor: 'date_purchased',
            Cell:  ({ value }) => { return formatDate(value) }
        }
        ,
        {
            Header: 'Amount',
            accessor: 'amount_paid'
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
        },
        {
            Header: 'Delete',
            accessor: 'id',
            id: 'delete',
            Cell:  ({ value }) => { return <Link to={`/delete-item/${value}`}>delete</Link> } 
        }
    
    ]
}
    




   return itemsData ? (
        <>
        <FilterTable data={itemsData} columns={COLUMNS} />
        </>
    ) : <p>LOADING...</p>
  }


export {StuffGroupTable}

