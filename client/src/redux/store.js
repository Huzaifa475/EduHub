import { configureStore } from "@reduxjs/toolkit";
import profileReducer from './profileSlice.js';
import notificationReducer from './notificationSlice.js';
import roomReducer from './roomSlice.js';
import fileReducer from './fileSlice.js';
import taskReducer from './taskSlice.js';

const store = configureStore({
    reducer: {
        profile: profileReducer,
        notification: notificationReducer,
        room: roomReducer,
        file: fileReducer,
        task: taskReducer
    }
})

export default store;