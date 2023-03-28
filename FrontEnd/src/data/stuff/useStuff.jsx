import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getItemGroups, deleteItemGroup } from './apiStuff'


const useItemGroups = () => {
    const groupQuery = useQuery({
        queryKey: ['itemGroups'],
        queryFn: () => getItemGroups() 
    })
    return groupQuery
}
  
const useDeleteItemGroup = () => {
    const queryClient = useQueryClient()
    const deleteGroupMutation = useMutation({
        mutationFn: (group_id) => deleteItemGroup(group_id),
        onMutate: async (props) => {
            console.log("on mutate")
            console.log(props)
        },
        onSuccess: (props) => {
            console.log('mutate success')
            console.log(props)
            return queryClient.invalidateQueries(['itemGroups'])
        },
        onError: (props) => {
            console.log('mutate error')
        }
       })
    return deleteGroupMutation
}

  export { useItemGroups, useDeleteItemGroup }