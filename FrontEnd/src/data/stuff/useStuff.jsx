import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getItemGroups, deleteItemGroup, addItemGroup, editGroupName, editGroupNote } from './apiStuff'


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

const useAddItemGroup = (data) => {
    const queryClient = useQueryClient()
    const addGroupMutation = useMutation({
        mutationFn: (data) => addItemGroup(data),
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
    return addGroupMutation
}

const useEditItemGroupName = () => {
    const queryClient = useQueryClient()
    const editMutation = useMutation({
        mutationFn: (data) => editGroupName(data),
        onMutate: async (props) => {
            console.log("on mutate name")
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
    return editMutation
}

const useEditItemGroupNote = () => {
    const queryClient = useQueryClient()
    const editMutation = useMutation({
        mutationFn: (data) => editGroupNote(data),
        onMutate: async (props) => {
            console.log("on mutate note")
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
    return editMutation
}

  export { useItemGroups, useDeleteItemGroup, useAddItemGroup, useEditItemGroupName, useEditItemGroupNote }