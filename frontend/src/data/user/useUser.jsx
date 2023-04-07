import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getUsers,
  deleteUser,
  editUserRoles,
  editUserEmail,
  confirmEmail,
} from "./apiUser"
import useAuth from "../../hooks/useAuth"

const useUsers = () => {
  const getQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  })
  return getQuery
}

const useDeleteUser = () => {
  const queryClient = useQueryClient()
  const deleteMutation = useMutation({
    mutationFn: (user_id) => deleteUser(user_id),
    onMutate: async (props) => {
      console.log("on mutate")
      console.log(props)
    },
    onSuccess: (props) => {
      console.log("mutate success")
      console.log(props)
      return queryClient.invalidateQueries(["users"])
    },
    onError: (props) => {
      console.log("mutate error")
    },
  })
  return deleteMutation
}

const useEditUserEmail = (toastRef) => {
  const { auth } = useAuth()
  let update_auth_email = false
  let new_email = ""
  const queryClient = useQueryClient()
  const editMutation = useMutation({
    mutationFn: (data) => editUserEmail(data),
    onMutate: async (props) => {
      console.log("ON MUTATE")
      console.log(props)
      update_auth_email = false
      new_email = ""
      if (props.user_id == auth.user_id) {
        update_auth_email = true
        new_email = props.email
      } else {
        console.log(
          `Edit User ID: ${props.user_id}, Auth User ID: ${auth.user_id}`
        )
      }
    },
    onSuccess: (props) => {
      console.log("mutate success")
      console.log(props)
      const { success, message } = props
      if (!success) {
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: message,
        })
      } else if (update_auth_email) {
        console.log("Updating Auth Email")
        auth.email = new_email
      }
      return queryClient.invalidateQueries(["users"])
    },
    onError: (props) => {
      console.log("mutate error")
    },
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
      console.log("mutate success")
      console.log(props)
      return queryClient.invalidateQueries(["users"])
    },
    onError: (props) => {
      console.log("mutate error")
    },
  })
  return editMutation
}

const useConfirmEmail = (setMessage) => {
  const queryClient = useQueryClient()
  const editMutation = useMutation({
    mutationFn: (token) => confirmEmail(token),
    onMutate: async (props) => {
      console.log("on mutate confirm email")
      console.log(props)
    },
    onSuccess: (props) => {
      console.log("mutate success")
      console.log(props)
      setMessage(JSON.stringify(props.message))
      queryClient.invalidateQueries(["users"])
      return props
    },
    onError: (props) => {
      console.log("mutate error")
    },
  })
  return editMutation
}

export {
  useUsers,
  useDeleteUser,
  useEditUserEmail,
  useEditUserRoles,
  useConfirmEmail,
}
