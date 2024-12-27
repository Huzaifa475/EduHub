import { configureStore } from "@reduxjs/toolkit";
import profileReducer from './profileSlice.js';

const store = configureStore({
    reducer: {
        profile: profileReducer
    }
})

export default store;