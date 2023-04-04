import React, { useMemo } from 'react'
import { useTable, useGlobalFilter } from 'react-table'

const GlobalFilter = ({ filter, setFilter }) => {
    return (
        <>
            Search:{' '}
            <input value={filter || ''} onChange={(e) => setFilter(e.target.value)} />
        </>
    )
}


const FilterTable = (props) => {


    //const { COLUMNS, DATA } = props;

    const columns = useMemo(() => props.columns, [])
    const data = useMemo(() => props.data, [])
    const tableInstance = useTable({
        columns,
        data
    }, useGlobalFilter)

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, state, setGlobalFilter } = tableInstance

    const { globalFilter } = state


   return (
    <>
    <br />
    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
    <br />
      <table className='data_table' {...getTableProps()}>
        <thead>
            { headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
                {
                    headerGroup.headers.map( column => (
                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>                    
                ))}
        </tr>
            ))}
        </thead>
        <tbody {...getTableBodyProps()}>
            { rows.map((row) => {
                prepareRow(row)
                return (
                    <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    })}
            </tr>
                )
            })}
        </tbody>
      </table>
      </>
    )
  }


export {FilterTable}

