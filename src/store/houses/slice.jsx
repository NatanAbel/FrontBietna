import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: true,
    houses: [],
    favorites: [],
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
        toggleFavorites : (state, action)=>{
            const idToAdd = action.payload
            // check if the user has already favorited
            const newFav = state.favorites.includes(idToAdd) ?
            // if it's already favorited remove it 
            state.favorites.filter(fav => fav !== idToAdd) : 
            // if it's not add to favorites
            [...state.favorites, idToAdd];
             
            state.favorites = newFav

            console.log("state.......",state.favorites)
        }

    }
})

export const{startLoading,housesFetched, toggleFavorites} = houseSlice.actions

export default houseSlice.reducer