import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: true,
    allHouses: [],
    pageCount: 1,
}

export const houseSlice = createSlice({
    name: 'house',
    initialState,
    reducers :{
        startLoading:(state)=>{
            state.loading = true;
        },
        housesFetched: (state, action)=>{
            const houseData = action.payload
            state.allHouses = houseData.result
            // // Create a set of existing house ids for quick lookup
            // const existingHouseIds = new Set(state.allHouses.map((house) => house._id));
            // // Filter out houses that are not already in the state
            // const newHouses = houseData.result.filter((house) => !existingHouseIds.has(house._id));
            // // Concatenate previous houses with new houses
            // state.allHouses = [...state.allHouses, ...newHouses];
            state.pageCount = houseData.pageCount
            state.loading = false
        },
        

    }
})

export const{startLoading,housesFetched} = houseSlice.actions

export default houseSlice.reducer