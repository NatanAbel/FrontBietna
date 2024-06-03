import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: true,
    houses: [],
    pageCount: 0,
}

export const houseSlice = createSlice({
    name: 'house',
    initialState,
    reducers :{
        startLoading:(state)=>{
            state.loading = true;
        },
        housesFetched: (state, action)=>{
            state.houses = action.payload
            state.loading = false
        },
        

    }
})

export const{startLoading,housesFetched} = houseSlice.actions

export default houseSlice.reducer