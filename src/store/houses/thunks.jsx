import axios from "axios"
import { housesFetched, startLoading } from "./slice"
import { current } from "@reduxjs/toolkit"

const API_URL = "http://localhost:5005"

export const fetchedHouses = async(dispatch, getState) =>{
    try{
        dispatch(startLoading())
        const response = await axios.get(`${API_URL}/houses`)
        // console.log("response...", response.data)
        dispatch(housesFetched(response.data))
    }catch(e){
        console.log(e.message)
    }

}