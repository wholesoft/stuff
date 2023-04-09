import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import {
  getGroups,
  deleteGroup,
  addGroup,
  editGroup,
  editGroupName,
  editGroupNote,
  getItems,
  deleteItem,
  addItem,
  editItemName,
  editItemNote,
  editItemPurchasedLocation,
  editItemPurchasedDate,
  editItemCost,
  getGroup,
} from "./apiStuff"

/* ITEM GROUPS */

const useGroup = (group_id) => {
  const groupQuery = useQuery({
    queryKey: ["groups", group_id],
    queryFn: () => getGroup(group_id),
  })
  return groupQuery
}

const useGroups = () => {
  const groupQuery = useQuery({
    queryKey: ["groups"],
    queryFn: () => getGroups(),
  })
  return groupQuery
}

const useDeleteGroup = (toastRef) => {
  const queryClient = useQueryClient()
  const deleteGroupMutation = useMutation({
    mutationFn: (group_id) => deleteGroup(group_id),
    onMutate: async (props) => {
      console.log("on mutate")
      console.log(props)
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
      }
      return queryClient.invalidateQueries(["groups"])
    },
    onError: (props) => {
      console.log("mutate error")
    },
  })
  return deleteGroupMutation
}

const useAddGroup = (toastRef) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const addGroupMutation = useMutation({
    mutationFn: (data) => addGroup(data),
    onMutate: async (props) => {
      console.log("on mutate")
      console.log(props)
    },
    onSuccess: (props) => {
      console.log("mutate success")
      console.log(props)
      toastRef.current.show({
        severity: "info",
        summary: "Saved",
        detail: "Group Saved.",
      })
      navigate("/mystuff") // TODO: display toast message after navigating
      return queryClient.invalidateQueries(["groups"])
    },
    onError: (props) => {
      console.log(props)
      console.log("mutate error")
    },
  })
  return addGroupMutation
}

const useEditGroup = (toastRef) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const editMutation = useMutation({
    mutationFn: (data) => editGroup(data),
    onMutate: async (props) => {
      console.log("on mutate group")
      console.log(props)
      toastRef.current.show({
        severity: "info",
        summary: "Saved",
        detail: "Group Saved.",
      })
      navigate("/mystuff") // TODO: display toast message after navigating
      return queryClient.invalidateQueries(["groups", "group"])
    },
    onSuccess: (props) => {
      console.log("mutate success")
      //console.log(props.data)
      //console.log(props.data.group_id)
      //queryClient.invalidateQueries(["groups", props.data.group_id])
      return queryClient.invalidateQueries(["groups"])
    },
    onError: (props) => {
      console.log("mutate error")
    },
  })
  return editMutation
}

const useEditGroupName = () => {
  const queryClient = useQueryClient()
  const editMutation = useMutation({
    mutationFn: (data) => editGroupName(data),
    onMutate: async (props) => {
      console.log("on mutate name")
      console.log(props)
    },
    onSuccess: (props) => {
      console.log("mutate success")
      console.log(props)
      return queryClient.invalidateQueries(["groups"])
    },
    onError: (props) => {
      console.log("mutate error")
    },
  })
  return editMutation
}

const useEditGroupNote = () => {
  const queryClient = useQueryClient()
  const editMutation = useMutation({
    mutationFn: (data) => editGroupNote(data),
    onMutate: async (props) => {
      console.log("on mutate note")
      console.log(props)
    },
    onSuccess: (props) => {
      console.log("mutate success")
      console.log(props)
      return queryClient.invalidateQueries(["groups"])
    },
    onError: (props) => {
      console.log("mutate error")
    },
  })
  return editMutation
}

/* ITEMS */

const useItems = (group_id) => {
  console.log(group_id)
  const getQuery = useQuery({
    queryKey: ["items", group_id],
    queryFn: () => getItems(group_id),
  })
  return getQuery
}

const useDeleteItem = () => {
  const queryClient = useQueryClient()
  const deleteMutation = useMutation({
    mutationFn: (item_id) => deleteItem(item_id),
    onMutate: async (props) => {
      console.log("on mutate")
      console.log(props)
    },
    onSuccess: (props) => {
      console.log("mutate success")
      console.log(props)
      return queryClient.invalidateQueries(["items"])
    },
    onError: (props) => {
      console.log("mutate error")
    },
  })
  return deleteMutation
}

const useAddItem = (toastRef) => {
  const queryClient = useQueryClient()
  const addMutation = useMutation({
    mutationFn: (data) => addItem(data),
    onMutate: async (props) => {
      console.log("on mutate")
      console.log(props)
    },
    onSuccess: (props) => {
      console.log("mutate success")
      console.log(props)
      toastRef.current.show({
        severity: "info",
        summary: "Saved",
        detail: "Item Saved.",
      })
      return queryClient.invalidateQueries(["items"])
    },
    onError: (props) => {
      console.log("mutate error")
    },
  })
  return addMutation
}

const useEditItemName = () => {
  const queryClient = useQueryClient()
  const editMutation = useMutation({
    mutationFn: (data) => editItemName(data),
    onMutate: async (props) => {
      console.log("on mutate name")
      console.log(props)
    },
    onSuccess: (props) => {
      console.log("mutate success")
      console.log(props)
      return queryClient.invalidateQueries(["items"])
    },
    onError: (props) => {
      console.log("mutate error")
    },
  })
  return editMutation
}

const useEditItemNote = () => {
  const queryClient = useQueryClient()
  const editMutation = useMutation({
    mutationFn: (data) => editItemNote(data),
    onMutate: async (props) => {
      console.log("on mutate name")
      console.log(props)
    },
    onSuccess: (props) => {
      console.log("mutate success")
      console.log(props)
      return queryClient.invalidateQueries(["items"])
    },
    onError: (props) => {
      console.log("mutate error")
    },
  })
  return editMutation
}

const useEditItemPurchasedLocation = () => {
  const queryClient = useQueryClient()
  const editMutation = useMutation({
    mutationFn: (data) => editItemPurchasedLocation(data),
    onMutate: async (props) => {
      console.log("on mutate name")
      console.log(props)
    },
    onSuccess: (props) => {
      console.log("mutate success")
      console.log(props)
      return queryClient.invalidateQueries(["items"])
    },
    onError: (props) => {
      console.log("mutate error")
    },
  })
  return editMutation
}

const useEditItemPurchasedDate = () => {
  const queryClient = useQueryClient()
  const editMutation = useMutation({
    mutationFn: (data) => editItemPurchasedDate(data),
    onMutate: async (props) => {
      console.log("on mutate name")
      console.log(props)
    },
    onSuccess: (props) => {
      console.log("mutate success")
      console.log(props)
      return queryClient.invalidateQueries(["items"])
    },
    onError: (props) => {
      console.log("mutate error")
    },
  })
  return editMutation
}

const useEditItemCost = () => {
  const queryClient = useQueryClient()
  const editMutation = useMutation({
    mutationFn: (data) => editItemCost(data),
    onMutate: async (props) => {
      console.log("on mutate name")
      console.log(props)
    },
    onSuccess: (props) => {
      console.log("mutate success")
      console.log(props)
      return queryClient.invalidateQueries(["items"])
    },
    onError: (props) => {
      console.log("mutate error")
    },
  })
  return editMutation
}

export {
  useGroups,
  useGroup,
  useEditGroup,
  useDeleteGroup,
  useAddGroup,
  useEditGroupName,
  useEditGroupNote,
  useItems,
  useDeleteItem,
  useAddItem,
  useEditItemName,
  useEditItemNote,
  useEditItemPurchasedLocation,
  useEditItemPurchasedDate,
  useEditItemCost,
}
