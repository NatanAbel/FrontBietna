import {configureStore} from "@reduxjs/toolkit"
import houseSlice  from "./houses/slice"
import houseDetailsSlice  from "./houseDetails/slice"

const store = configureStore({
    reducer:{
        house : houseSlice,
        houseDetails: houseDetailsSlice,
    }    
})

export default store