import React, { useMemo } from 'react'
import { useResourcePrivate } from '../hooks/useResourcePrivate'
import { BasicTable } from '../components/BasicTable'

const COLUMNS  = [
    {
        Header: 'ID',
        accessor: 'id'
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
        accessor: 'last_login'
    },
    {
        Header: 'Total Logins',
        accessor: 'n_logins'
    },
    {
        Header: 'Email Confirmed',
        accessor: 'email_confirmed'
    },
    {
        Header: 'Created',
        accessor: 'created'
    }

]



const UsersTable = () => {
    let userData = useResourcePrivate(`/users`);
    console.log(userData);

   return userData ? (
        <>
        <BasicTable data={userData} columns={COLUMNS} />
        </>
    ) : <p>LOADING...</p>
  }


export {UsersTable}

