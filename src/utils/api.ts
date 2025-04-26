import axios from "axios";
import { initData } from "@telegram-apps/sdk";

const BASE_API_URL = import.meta.env.VITE_API_URL

const request = async (endpoint: string, method: string = "GET", data?:any) =>{
    const response = await axios.request({
        url: `${BASE_API_URL}/${endpoint}`,
        method: method,
        headers: {
            initData: `${initData.raw()}`,
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        data: data ? JSON.stringify(data) : undefined
    })

    return response
}

export default request
