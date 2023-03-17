import React, { useMemo } from 'react'
import { useTable, useSortBy } from 'react-table'

const SortTable = (props) => {


    //const { COLUMNS, DATA } = props;

    const columns = useMemo(() => props.columns, [])
    const data = useMemo(() => props.data, [])
    const tableInstance = useTable({
        columns,
        data
    }
    ,useSortBy)

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance




   return (
      <table className='data_table' {...getTableProps()}>
        <thead>
            { headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
                {
                    headerGroup.headers.map( column => (
                        <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                            {column.render('Header')}
                            <span>
                                {column.isSorted ? (column.isSortedDesc ?  ' 🔽' : ' 🔼') : 'xxx' /* BUG: SORT ICONS NOT APPEARING */}
                            </span>
                        </th>                    
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


export {SortTable}

