import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token:null,
    loading:true,
    me:null,
    isAuthenticated:false,
    status:null,
}

export const loginSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{

        startLoading: (state)=>{
            state.loading = true;
        },
        userLogedIn : (state, action)=>{
            state.token = action.payload.token
            state.me = action.payload.me
            state.isAuthenticated = true
            state.loading = false;
        },
        updateUser: (state, action) => {
            state.me = { ...state.me, ...action.payload };
          },
        toggleFavorites : (state, action)=>{
            const idToAdd = action.payload
            if(state.me){
            // check if the user has already favorited
            const newFav = state.me.favorites.includes(idToAdd) ?
            // if it's already favorited remove it 
            state.me.favorites.filter(fav => fav !== idToAdd) : 
            // if it's not add to favorites
            [...state.me.favorites, idToAdd];
             
            state.me.favorites = newFav
        }
        },
        statusResponse: (state, action)=>{
            state.status = action.payload
            
        },
        logout : (state)=>{
            if(state.token) {
                localStorage.removeItem("token")
                state.token = null
                state.me = null
                state.isAuthenticated = false
                state.loading = true
            }
        },

    }
})

export const {startLoading, userLogedIn, updateUser, toggleFavorites,statusResponse,logout} = loginSlice.actions

export default loginSlice.reducer