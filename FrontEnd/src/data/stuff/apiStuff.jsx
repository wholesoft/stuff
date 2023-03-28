import { axiosGet } from '../axios'

const getItemGroups = async () => { 
    const url = `/stuff_groups`;
    const response = await axiosGet(url);
    return response.data;
}

const deleteItemGroup = async (group_id) => {
    const url = `/delete_group/${group_id}`
    const response = await axiosGet(url);
    console.log(response.data);
    return response.data;
}

export { getItemGroups, deleteItemGroup }