import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true
export const fetchFiles = ({roomId}) => async(dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const res = await axios({
            method: 'get',
            url: `/api/v1/files/get-files/${roomId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(setFiles(res?.data?.data))
    } catch (error) {
        dispatch(setError(error?.message))
    }
}

export const deleteFile = ({roomId, fileId}) => async(dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const res = await axios({
            method: 'delete',
            url: `/api/v1/files/delete/${fileId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(fetchFiles({roomId}))
    } catch (error) {
        dispatch(setError(error?.message))
        toast.error(error?.message, {duration: 1000})
    }
}

const initialState = {
    file: {},
    loading: false,
    error: null
}

const fileSlice = createSlice({
    name: 'file',
    initialState,
    reducers: {
        setFiles: (state, action) => {
            state.file = action.payload
            state.loading = false
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

export const {setFiles, setLoading, setError, resetState} = fileSlice.actions
export default fileSlice.reducer