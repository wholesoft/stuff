import { axiosGet } from './axiosQuery'

const getItemGroups = async () => { 

    let url = `/stuff_groups`;
    const response = await axiosGet(url);
    return response.data;

}

export { getItemGroups }