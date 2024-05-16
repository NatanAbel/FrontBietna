import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token:null,
    loading:null,
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
            state.loading = false;
        }
    }
})

export const {startLoading, userLogedIn } = loginSlice.actions

export default loginSlice.reducer