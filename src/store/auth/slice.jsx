import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token:null,
    loading:true,
    me:null,
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
            console.log("state.me.....",state.me)
            state.loading = false;
        },
        updateUser: (state, action) => {
            state.me = { ...state.me, ...action.payload };
          },
        logout : (state)=>{
            if(state.token) {
                localStorage.removeItem("token")
                state.token = null
                state.me = null
                state.loading = true
            }
        }
    }
})

export const {startLoading, userLogedIn, updateUser, logout} = loginSlice.actions

export default loginSlice.reducer