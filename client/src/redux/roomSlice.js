import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

export const fecthRooms = () => async(dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const res = await axios({
            method: 'get',
            url: '/api/v1/rooms/user-rooms',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(setRooms(res?.data?.data))
    } catch (error) {
        dispatch(setError(error?.message))
        toast.error(error?.message, {duration: 1000})
    }
}

export const fetchRequestedRooms = () => async(dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const res = await axios({
            method: 'get',
            url: '/api/v1/rooms/user-requests',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(setRequestedRooms(res?.data?.data))
    } catch (error) {
        dispatch(setError(error?.message))
        toast.error(error?.message, {duration: 1000})
    }
}

export const fetchSearchRooms = ({ prompt }) => async(dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const res = await axios({
            method: 'get',
            url: '/api/v1/rooms/search-room',
            data: {
                prompt
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(setSearchRooms(res?.data?.data))
    } catch (error) {
        dispatch(setError(error?.message))
        toast.error(error?.message, {duration: 1000})
    }
}

export const createRoom = ({name, description, publicOrPrivate, tags}) => async(dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const res = await axios({
            method: 'post',
            url: '/api/v1/rooms/create',
            data: {
                name,
                description,
                publicOrPrivate,
                tags
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        toast.success(res?.data?.message, {duration: 1000})
    } catch (error) {
        dispatch(setError(error?.message))
        toast.error(error?.message, {duration: 1000})
    }
}

const initialState = {
    rooms: {},
    requestedRooms: {},
    searchRooms: {},
    loading: false,
    error: null
}

const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        setRooms: (state, action) => {
            state.rooms = action.payload
            state.loading = false
            state.error = null
        },
        setRequestedRooms: (state, action) => {
            state.requestedRooms = action.payload
            state.loading = false
            state.error = null
        },
        setSearchRooms: (state, action) => {
            state.searchRooms = action.payload,
            state.loading = false,
            state.error = null
        },
        setLoading: (state) => {
            state.loading = true
        },
        setError: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        resetState: () => initialState
    }
})

export const {setRooms, setRequestedRooms, setSearchRooms, setLoading, setError, resetState} = roomSlice.actions
export default roomSlice.reducer