import axios from "axios"
import { houseFatchedfully, startLoading } from "./slice"


const API_URL = import.meta.env.VITE_BACK_URL;

export const fetchDetailsPage = (houseId)=> async(dispatch, getState) => {
    try{
        startLoading()

        const res = await axios.get(`${API_URL}/houses/${houseId}`)
        const house = res.data
        dispatch(houseFatchedfully(house))
    }catch(err){
        console.log(err)
    }
}