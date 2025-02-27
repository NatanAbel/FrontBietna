import {configureStore} from "@reduxjs/toolkit"
import storageSession from "redux-persist/lib/storage/session";
import { persistReducer, persistStore } from "redux-persist";
import houseSlice  from "./houses/slice"
import houseDetailsSlice  from "./houseDetails/slice"
import loginSlice  from "./auth/slice"

// // Persist only isAuthenticated using sessionStorage
const authPersistConfig = {
    key: "auth",
    storage: storageSession,  // Uses sessionStorage instead of localStorage
    whitelist: ["isAuthenticated"], // Only persist this field
};

// Create persisted reducer for auth slice
const persistedAuthReducer = persistReducer(authPersistConfig, loginSlice);

const store = configureStore({
    reducer:{
        house: houseSlice,
        houseDetails: houseDetailsSlice,
        auth: persistedAuthReducer,
    },
    middleware:(getDefaultMiddleware)=> getDefaultMiddleware({
        serializableCheck: false
    }),
    devTools: false,
})

// Persistor to manage rehydration
export const persistor = persistStore(store);

export default store;

