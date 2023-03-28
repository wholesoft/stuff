import { axiosAuth } from '../axios'

const getItemGroups = async () => { 
    const url = `/stuff_groups`;
    const response = await axiosAuth.get(url);
    return response.data;
}

const deleteItemGroup = async (group_id) => {
    const url = `/delete_group/${group_id}`
    const response = await axiosAuth.get(url);
    console.log(response.data);
    return response.data;
}

const addItemGroup = async (props) => {
    const { group, notes } = props
    const url = '/add_stuff_group'
    const data = JSON.stringify({group, notes })
    const response = await axiosAuth.post(url, data)
    console.log(response)
    return response
}

export { getItemGroups, deleteItemGroup, addItemGroup }