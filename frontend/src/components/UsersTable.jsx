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

const COLUMNS  = [
    {
        Header: 'ID',
        accessor: 'id',
        Cell: ({ value }) => { return <Link to={"/user/" + value}>{value}</Link> }
    },
    {
        Header: 'Email',
        accessor: 'email'
    },
    {
        Header: 'Roles',
        accessor: 'roles'
    },
    {
        Header: 'Last Login',
        accessor: 'last_login',
        Cell:  ({ value }) => { return formatDate(value) }
    },
    {
        Header: 'Total Logins',
        accessor: 'n_logins'
    },
    {
        Header: 'Email Confirmed',
        accessor: 'email_confirmed',
        Cell:  ({ value }) => { return formatDate(value) }
    },
    {
        Header: 'Created',
        accessor: 'created',
        Cell:  ({ value }) => { return formatDate(value) }
    }

]



const UsersTable = () => {
    let userData = useResourcePrivate(`/users`);
    console.log(userData);

   return userData ? (
        <>
        <FilterTable data={userData} columns={COLUMNS} />
        </>
    ) : <p>LOADING...</p>
  }


export {UsersTable}

