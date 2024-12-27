import { configureStore } from "@reduxjs/toolkit";
import profileReducer from './profileSlice.js';
import notificationReducer from './notificationSlice.js';

const store = configureStore({
    reducer: {
        profile: profileReducer,
        notification: notificationReducer
    }
})

export default store;