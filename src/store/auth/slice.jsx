import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token:null,
    loading:true,
    me:null,
    isAuthenticated:false,
    status:null,
    message:"",
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
            state.message = ""
            state.loading = false;
        },
        updateUser: (state, action) => {
            state.me = { ...state.me, ...action.payload };
          },
        toggleFavorites : (state, action)=>{
            const idToAdd = action.payload
            if (state.me && Array.isArray(state.me.favorites)) {
                // Check if ID exists in favorites
                const exists = state.me.favorites.some(fav => fav._id === idToAdd);
                
                if (exists) {
                  // Remove from favorites
                  state.me.favorites = state.me.favorites.filter(fav => fav._id !== idToAdd);
                } else {
                  // Add to favorites as an object
                  state.me.favorites.push({ _id: idToAdd });
                }
              }
        },
        houseDelete : (state, action)=>{
            const idToDelete = action.payload
            
            if(state.me){
                const houseToDelete = state.me.published.includes(idToDelete) ? state.me.published.filter(id=> id !==idToDelete) :  [...state.me.published];
                
                state.me.published = houseToDelete
            }
        },
        statusResponse: (state, action)=>{
            state.status = action.payload
            
        },
        messageResponse: (state, action)=>{
            state.message = action.payload
        },
        logout : (state)=>{
            if(state.me || state.isAuthenticated) {
                // localStorage.removeItem("token")
                sessionStorage.removeItem("persist:auth"); // Clear persisted state
                state.token = null
                state.me = null
                state.isAuthenticated = false
                state.loading = true
                state.status = null
                state.message = ""
            }
        },

    }
})

export const {startLoading, userLogedIn, updateUser, toggleFavorites,statusResponse,messageResponse,logout,houseDelete} = loginSlice.actions

export default loginSlice.reducer