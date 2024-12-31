import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

axios.defaults.withCredentials = true
export const fetchProfile = () => async (dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const res = await axios({
            method: 'get',
            url: '/api/v1/users/get-current',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(setProfile(res?.data?.data))
    } catch (error) {
        dispatch(setError(error?.message))
    }
}

export const updateProfile = ({userName, email}) => async (dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const updateFields = {}
        if(userName) updateFields.userName = userName
        if(email) updateFields.email = email
        const res = await axios({
            method: 'patch',
            url: '/api/v1/users/update',
            data: {
                ...updateFields
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(fetchProfile())
        toast.success(res?.data?.message)
    } catch (error) {
        dispatch(setError(error?.response?.data?.message))
        toast.error(error?.message)
    }
}

const initialState = {
    profile: {},
    loading: false,
    error: null
}

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfile: (state, action) => {
            state.profile = action.payload
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

export const {setProfile, setLoading, setError, resetState} = profileSlice.actions
export default profileSlice.reducer