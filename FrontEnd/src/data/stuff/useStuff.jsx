import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getItemGroups } from './apiStuff'


const useItemGroups = () => {
    const queryClient = useQueryClient()

    const groupQuery = useQuery({
        queryKey: ["item_groups"],
        queryFn: () => getItemGroups() 
    })

    /*
    if (groupQuery.isLoading) return <h1>Loading...</h1>

    if (groupQuery.isError) {
        return <pre>{JSON.stringify(groupQuery.error)}</pre>
    }
    */
    //const { data, isLoading, error, invalidate } = useBooks(authorId);

    return groupQuery
  }

  export { useItemGroups }