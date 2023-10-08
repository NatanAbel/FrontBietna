import axios from "axios"
import { houseFatchedfully, startLoading } from "./slice"


const API_URL = "http://localhost:5005"

export const fetchDetailsPage = (houseId)=> async(dispatch, getState) => {
    try{
        startLoading()

        const res = await axios.get(`${API_URL}/houses/${houseId}`)
        const house = res.data
        dispatch(houseFatchedfully(house))
    }catch(err){
        console.log(err.message)
    }
}