import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true
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
            url: `/api/v1/rooms/search-room?prompt=${prompt}`,
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

export const fetchRoom = ({roomId}) => async (dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const res = await axios({
            method: 'get',
            url: `/api/v1/rooms/get-room/${roomId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(setRoom(res?.data?.data))
    } catch (error) {
        dispatch(setError(error?.message))
        toast.error(error?.message, {duration: 1000})
    }
}

export const fetchRoomMembers = ({roomId}) => async (dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const res = await axios({
            method: 'get',
            url: `/api/v1/rooms/get-members/${roomId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(setMembers(res?.data?.data))
    } catch (error) {
        dispatch(setError(error?.message))
        toast.error(error?.message, {duration: 1000})
    }
}

export const fetchRoomRequests = ({roomId}) => async (dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const res = await axios({
            method: 'get',
            url: `/api/v1/rooms/get-requests/${roomId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(setRoomRequests(res?.data?.data))
    } catch (error) {
        dispatch(setError(error?.message))
        toast.error(error?.message, {duration: 1000})
    }
}

export const removeAMember = ({roomId, memberId, navigate = null}) => async (dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const res = await axios({
            method: 'patch',
            url: `/api/v1/rooms/remove/${roomId}/${memberId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(fetchRoomMembers({roomId}))
        if(navigate){
            navigate('/rooms', {replace: true})
        }
    } catch (error) {
        dispatch(setError(error?.message))
        toast.error(error?.message, {duration: 1000})
    }
}

export const requestToRoom = ({roomId}) => async (dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const res = await axios({
            method: 'post',
            url: `/api/v1/rooms/request-room/${roomId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(roomStatus({roomId}))
        toast.success(res?.data?.message, {duration: 1000})
    } catch (error) {
        dispatch(setError(error?.message))
        toast.error(error?.message, {duration: 1000})
    }
}

export const roomStatus = ({roomId}) => async (dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const res = await axios({
            method: 'get',
            url: `/api/v1/rooms/room-status/${roomId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(setSearchRoom(res?.data?.data))
        toast.success(res?.data?.message, {duration: 1000})
    } catch (error) {
        dispatch(setError(error?.message))
        toast.error(error?.message, {duration: 1000})
    }
}

export const requestProcess = ({roomId, requestId, accept}) => async (dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const res = await axios({
            method: 'post',
            url: `/api/v1/rooms/request-process/${roomId}/${requestId}`,
            data: {
                accept
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(fetchRoomRequests({roomId}))
        dispatch(fetchRoomMembers({roomId}))
    } catch (error) {
        dispatch(setError(error?.message))
        toast.error(error?.message, {duration: 1000})
    }
}

export const createRoom = ({name, description, roomType, tags}) => async(dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const res = await axios({
            method: 'post',
            url: '/api/v1/rooms/create',
            data: {
                name,
                description,
                publicOrPrivate: roomType,
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

export const updateRoom = ({name, description, roomType, tags, roomId}) => async (dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    const updateFields = {}
    if(name) updateFields.name = name
    if(description) updateFields.description = description
    if(roomType) updateFields.publicOrPrivate = roomType
    if(tags) updateFields.tags = tags
    try {
        dispatch(setLoading())
        const res = await axios({
            method: 'patch',
            url: `/api/v1/rooms/update/${roomId}`,
            data: {
                ...updateFields
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

export const deleteRoom = ({roomId, navigate}) => async(dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const res = await axios({
            method: 'delete',
            url: `/api/v1/rooms/delete/${roomId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        toast.success(res?.data?.message, {duration: 1000})
        navigate('/rooms', {replace: true})
    } catch (error) {
        dispatch(setError(error?.message))
        toast.error(error?.message, {duration: 1000})
    }
}

const initialState = {
    rooms: {},
    requestedRooms: {},
    searchRooms: null,
    room: {},
    roomMembers: {},
    roomRequests: {},
    searchRoom: {},
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
        setRoom: (state, action) => {
            state.room = action.payload
            state.loading = false
            state.error = null
        },
        setMembers: (state, action) => {
            state.roomMembers = action.payload
            state.loading = false
            state.error = null
        },
        setRoomRequests: (state, action) => {
            state.roomRequests = action.payload
            state.loading = false
            state.error = null
        },
        setSearchRoom: (state, action) => {
            state.searchRoom = action.payload
            state.loading = false
            state.error = null
        },
        setLoading: (state) => {
            state.loading = true
        },
        resetLoading: (state) => {
            state.loading = false
        },
        setError: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        resetState: () => initialState
    }
})

export const {setRooms, setRequestedRooms, setSearchRooms, setRoom, setMembers, setRoomRequests, setSearchRoom, setLoading, resetLoading, setError, resetState} = roomSlice.actions
export default roomSlice.reducer