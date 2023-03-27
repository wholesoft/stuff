import { FilterTable } from './FilterTable'
import { Link } from 'react-router-dom';
import { useItemGroups } from '../data/stuff/useStuff'

function formatDate(date_string)
{
    let result = ""
    if (date_string != null)
    {
        result = new Date(date_string).toLocaleDateString() 
    }
    return result;
}

const StuffGroupsTable2 = () => {
    const useGroups = useItemGroups();
    const groupQuery = useGroups[0];
    const deleteGroupMutation = useGroups[1];

    const groupData = groupQuery.data;

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
            Cell:  ({ value }) => { return <Link to={`/edit-group/${value}`} state={{ data: groupData.filter(group => group.id == value) }}>edit</Link> }
        },
        {
            Header: 'Delete',
            id: 'delete',
            accessor: 'id',
            Cell:  ({ value }) => { return <button
            disabled={ deleteGroupMutation.isLoading }
            onClick={() => deleteGroupMutation.mutate(value) }>Delete
            </button> }
        }
    
    ]

    if (groupQuery.isLoading) return <h1>Loading...</h1>
    if (groupQuery.isError) {
        return <pre>{JSON.stringify(groupQuery.error)}</pre>
    }
    return  <>
        <div>
        <h1>Stuff Query</h1>
        {/* JSON.stringify(groupData) */}
        <br />
        </div>
        <FilterTable data={groupData} columns={COLUMNS} />
        
        </>
  }


export {StuffGroupsTable2}

