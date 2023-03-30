import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUsers, deleteUser, editUserRoles, editUserEmail } from './apiUser'

const useUsers = () => {
    const getQuery = useQuery({
        queryKey: ['users'],
        queryFn: () => getUsers() 
    })
    return getQuery
}

const useDeleteUser = () => {
    const queryClient = useQueryClient()
    const deleteMutation = useMutation({
        mutationFn: (item_id) => deleteUser(item_id),
        onMutate: async (props) => {
            console.log("on mutate")
            console.log(props)
        },
        onSuccess: (props) => {
            console.log('mutate success')
            console.log(props)
            return queryClient.invalidateQueries(['users'])
        },
        onError: (props) => {
            console.log('mutate error')
        }
       })
    return deleteMutation
}

const useEditUserEmail = () => {
    const queryClient = useQueryClient()
    const editMutation = useMutation({
        mutationFn: (data) => editUserEmail(data),
        onMutate: async (props) => {
            console.log("on mutate name")
            console.log(props)
        },
        onSuccess: (props) => {
            console.log('mutate success')
            console.log(props)
            return queryClient.invalidateQueries(['users'])
        },
        onError: (props) => {
            console.log('mutate error')
        }
       })
    return editMutation
}

const useEditUserRoles = () => {
    const queryClient = useQueryClient()
    const editMutation = useMutation({
        mutationFn: (data) => editUserRoles(data),
        onMutate: async (props) => {
            console.log("on mutate name")
            console.log(props)
        },
        onSuccess: (props) => {
            console.log('mutate success')
            console.log(props)
            return queryClient.invalidateQueries(['users'])
        },
        onError: (props) => {
            console.log('mutate error')
        }
       })
    return editMutation
}




export { useUsers, useDeleteUser, useEditUserEmail, useEditUserRoles }
