import React, { useMemo } from 'react'
import { useTable } from 'react-table'

const BasicTable = (props) => {


    //const { COLUMNS, DATA } = props;

    const columns = useMemo(() => props.columns, [])
    const data = useMemo(() => props.data, [])
    const tableInstance = useTable({
        columns,
        data
    })

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance




   return (
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
    )
  }


export {BasicTable}

