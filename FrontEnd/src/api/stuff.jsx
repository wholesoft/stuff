import { axiosGet } from './axiosQuery'

const getItemGroups = async () => { 

    let url = `/stuff_groups`;
    //url = '/users/30';

    return axiosGet(url);

}

export { getItemGroups }