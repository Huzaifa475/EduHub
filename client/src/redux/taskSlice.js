import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true
export const fetchTasks = ({roomId}) => async(dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const res = await axios({
            method: 'get',
            url: `/api/v1/tasks/get-tasks/${roomId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(setTasks(res?.data?.data))
    } catch (error) {
        dispatch(setError(error?.message))
        toast.error(error?.message, {duration: 1000})
    }
}

export const createTask = ({creator, title, tasks, isCompleted, room}) => async(dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try { 
        dispatch(setLoading())
        const roomId = room
        const res = await axios({
            method: 'post',
            url: `/api/v1/tasks/create/${roomId}`,
            data: {
                creator,
                title,
                tasks,
                isCompleted,
                room
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(fetchTasks({roomId}))
    } catch (error) {
        dispatch(setError(error?.message))
        toast.error(error?.message, {duration: 1000})
    }
}

export const deleteTask = ({taskId, roomId}) => async(dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const res = await axios({
            method: 'delete',
            url: `/api/v1/tasks/delete/${taskId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(fetchTasks({roomId}))
    } catch (error) {
        dispatch(setError(error?.message))
        toast.error(error?.message, {duration: 1000})
    }
}

export const toggleTask = ({taskId}) => async(dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const res = await axios({
            method: 'patch',
            url: `/api/v1/tasks/toggle-status/${taskId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(fetchTask({taskId}))
    } catch (error) {
        dispatch(setError(error?.message))
        toast.error(error?.message, {duration: 1000})
    }
}

export const fetchTask = ({taskId}) => async(dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const res = await axios({
            method: 'get',
            url: `/api/v1/tasks/get-task/${taskId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(setTask(res?.data?.data))
    } catch (error) {
        dispatch(setError(error?.message))
        toast.error(error?.message, {duration: 1000})
    }
}

const initialState = {
    tasks: {},
    task: {},
    loading: false,
    error: null
}

const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        setTasks: (state, action) => {
            state.tasks = action.payload
            state.loading = false
            state.error = null
        },
        setTask: (state, action) => {
            state.task = action.payload
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

export const {setTasks, setTask, setLoading, setError, resetState} = taskSlice.actions
export default taskSlice.reducer