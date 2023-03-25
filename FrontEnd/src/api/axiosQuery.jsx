/* 
Needs to return a Promise
*/
import { axiosPrivate, authApi } from "../api/axios";

const axiosGet = async (url) => { 

    //const request = axiosPrivate.get(url)
    console.log("axiosGet");
    const request = authApi.get(url)
    return request
}

export { axiosGet }