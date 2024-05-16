import {configureStore} from "@reduxjs/toolkit"
import houseSlice  from "./houses/slice"
import houseDetailsSlice  from "./houseDetails/slice"
import loginSlice  from "./auth/slice"

const store = configureStore({
    reducer:{
        house : houseSlice,
        houseDetails: houseDetailsSlice,
        auth: loginSlice,
    }    
})

export default store;