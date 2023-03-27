import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getItemGroups, deleteItemGroup } from './apiStuff'


const useItemGroups = () => {
    const queryClient = useQueryClient()

    const groupQuery = useQuery({
        queryKey: ["item_groups"],
        queryFn: () => getItemGroups() 
    })

    const deleteGroupMutation = useMutation({
        mutationFn: (group_id) => deleteItemGroup(group_id),
        onSuccess: () => {
            queryClient.invalidateQueries(["item_groups"])
        }
    })

    return [groupQuery, deleteGroupMutation]
  }



  export { useItemGroups }