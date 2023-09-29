import {configureStore} from "@reduxjs/toolkit"
import houseSlice  from "./house/slice"

const store = configureStore({
    reducer:{
        house : houseSlice
    }    
})

export default store