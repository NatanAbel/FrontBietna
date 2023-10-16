import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: true,
    house : null,
} 

export const houseDetailsSlice = createSlice({
    name : "houseDetails",
    initialState,
    reducers : {
        startLoading : (state)=>{
            state.loading = true;
        },
        houseFatchedfully : (state, action)=>{
            const id= action.payload
            state.house = id;
            console.log("state......",state.house);
            state.loading = false;
        }
    }
})

export const {startLoading, houseFatchedfully} = houseDetailsSlice.actions;

export default houseDetailsSlice.reducer