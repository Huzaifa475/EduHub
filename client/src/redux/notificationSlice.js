import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true
export const fetchNotifications = () => async(dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const res = await axios({
            method: 'get',
            url: '/api/v1/notifications/get-notifications',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(setNotification(res?.data?.data))
    } catch (error) {
        dispatch(setError(error?.message))
    }
}

export const deleteNotification = (notificationId) => async(dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const res = await axios({
            method: 'delete',
            url: `/api/v1/notifications/delete-single-notification/${notificationId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(fetchNotifications())
        toast.success(res?.data?.message)
    } catch (error) {
        dispatch(setError(error?.message))
        toast.error(error?.message)
    }
}

export const deleteNotifications = () => async(dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const res = await axios({
            method: 'delete',
            url: `/api/v1/notifications/delete-notifications`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(fetchNotifications())
        toast.success(res?.data?.message)
    } catch (error) {
        dispatch(setError(error?.message))
        toast.error(error?.message)
    }
}

const initialState = {
    notification: {},
    loading: true,
    error: null
}

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotification: (state, action) => {
            state.notification = action.payload
            state.loading = false,
            state.error = null
        },
        setLoading: (state) => {
            state.loading = true
        },
        setError: (state, action) => {
            state.loading = false,
            state.error = action.payload
        },
        resetState: () => initialState
    }
})

export const {setNotification, setLoading, setError, resetState} = notificationSlice.actions
export default notificationSlice.reducer