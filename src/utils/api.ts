import axios from "axios";
import { initData } from "@telegram-apps/sdk";

const BASE_API_URL = 'https://29a8c288d84da0bb77bd007eb3e28758.serveo.net'

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
