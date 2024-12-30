import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { createTask, deleteTask, fetchTasks } from '../../redux/taskSlice'
import { Button, IconButton, Skeleton, Stack, TextField, Typography } from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import './index.css'

function Task() {
    const [title, setTitle] = useState('')
    const [taskList, setTaskList] = useState([{ taskName: '' }])
    const [isCompleted, setIsCompleted] = useState(false)
    const userId = localStorage.getItem('id')
    const { tasks, loading, error } = useSelector(state => state.task)
    const { roomId } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(fetchTasks({ roomId }))
    }, [dispatch])

    const handleTaskChange = (index, value) => {
        const updatedTasks = [...taskList]
        updatedTasks[index].taskName = value
        setTaskList(updatedTasks)
    }

    const addTask = () => {
        setTaskList([...taskList, { taskName: '' }])
    }

    const removeTask = (index) => {
        const updatedTasks = taskList.filter((_, i) => i !== index)
        setTaskList(updatedTasks)
    }

    const handleCreate = () => {
        dispatch(createTask({ creator: userId, title, tasks: taskList, isCompleted, room: roomId }))
        setTitle('')
        setTaskList([{ taskName: '' }])
        setIsCompleted(false)
    }

    if (loading) {
        return (
            <div className="task-container">
                <div className="task-header">
                    <h1>Task</h1>
                </div>
                <div className="task-content">
                    <div className="task-create">
                        <TextField
                            label="Task Title"
                            autoComplete='off'
                            autoSave='off'
                            sx={{ color: '#66b3ff', bgcolor: 'hsla(215, 15%, 40%, 0.15)', label: { color: '#66b3ff' }, input: { color: '#66b3ff' }, borderRadius: '1rem' }}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <Typography>Task</Typography>
                        {taskList.map((task, index) => (
                            <TextField
                                label="Task"
                                autoComplete="off"
                                autoCorrect="off"
                                autoSave="off"
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <IconButton edge="start" color="error" size="small" onClick={() => removeTask(index)}>
                                            <RemoveIcon />
                                        </IconButton>
                                    ),
                                }}
                                sx={{ color: '#66b3ff', bgcolor: 'hsla(215, 15%, 40%, 0.15)', label: { color: '#66b3ff' }, input: { color: '#66b3ff' }, borderRadius: '1rem' }}
                                key={index}
                                value={task.taskName}
                                onChange={(e) => handleTaskChange(index, e.target.value)}
                            />
                        ))}
                        <Button onClick={addTask}><AddIcon /></Button>
                        <Button onClick={handleCreate}><CreateIcon />Create</Button>
                    </div>
                    <Stack className="task-display">
                        <Skeleton className='task' sx={{ backgroundColor: 'hsla(215, 15%, 40%, 0.15)', height: '100px' }} />
                        <Skeleton className='task' sx={{ backgroundColor: 'hsla(215, 15%, 40%, 0.15)', height: '100px' }} />
                        <Skeleton className='task' sx={{ backgroundColor: 'hsla(215, 15%, 40%, 0.15)', height: '100px' }} />
                        <Skeleton className='task' sx={{ backgroundColor: 'hsla(215, 15%, 40%, 0.15)', height: '100px' }} />
                        <Skeleton className='task' sx={{ backgroundColor: 'hsla(215, 15%, 40%, 0.15)', height: '100px' }} />
                    </Stack>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="task-container">
                <div className="task-header">
                    <h1>Task</h1>
                </div>
                <div className="task-content">
                    <div className="task-create">
                        <TextField
                            label="Task Title"
                            autoComplete='off'
                            autoSave='off'
                            sx={{ color: '#66b3ff', bgcolor: 'hsla(215, 15%, 40%, 0.15)', label: { color: '#66b3ff' }, input: { color: '#66b3ff' }, borderRadius: '1rem' }}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <Typography>Task</Typography>
                        {taskList.map((task, index) => (
                            <TextField
                                label="Task"
                                autoComplete="off"
                                autoCorrect="off"
                                autoSave="off"
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <IconButton edge="start" color="error" size="small" onClick={() => removeTask(index)}>
                                            <RemoveIcon />
                                        </IconButton>
                                    ),
                                }}
                                sx={{ color: '#66b3ff', bgcolor: 'hsla(215, 15%, 40%, 0.15)', label: { color: '#66b3ff' }, input: { color: '#66b3ff' }, borderRadius: '1rem' }}
                                key={index}
                                value={task.taskName}
                                onChange={(e) => handleTaskChange(index, e.target.value)}
                            />
                        ))}
                        <Button onClick={addTask}><AddIcon /></Button>
                        <Button onClick={handleCreate}><CreateIcon />Create</Button>
                    </div>
                    <div className="task-display">
                        <h1>Error Occured</h1>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="task-container">

            <div className="task-header">
                <h1>Task</h1>
            </div>

            <div className="task-content">

                <div className="task-create">
                    <TextField
                        label="Task Title"
                        autoComplete='off'
                        autoSave='off'
                        sx={{ color: '#66b3ff', bgcolor: 'hsla(215, 15%, 40%, 0.15)', label: { color: '#66b3ff' }, input: { color: '#66b3ff' }, borderRadius: '1rem' }}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <Typography>Task</Typography>
                    {taskList.map((task, index) => (
                        <TextField
                            label="Task"
                            autoComplete="off"
                            autoCorrect="off"
                            autoSave="off"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <IconButton edge="start" color="error" size="small" onClick={() => removeTask(index)}>
                                        <RemoveIcon />
                                    </IconButton>
                                ),
                            }}
                            sx={{ color: '#66b3ff', bgcolor: 'hsla(215, 15%, 40%, 0.15)', label: { color: '#66b3ff' }, input: { color: '#66b3ff' }, borderRadius: '1rem' }}
                            key={index}
                            value={task.taskName}
                            onChange={(e) => handleTaskChange(index, e.target.value)}
                        />
                    ))}
                    <Button onClick={addTask}><AddIcon /></Button>
                    <Button onClick={handleCreate}><CreateIcon />Create</Button>
                </div>

                <div className="task-display">

                    {
                        tasks && tasks.length > 0 ?
                            tasks.map((task) => (
                                <div className="task" key={task._id}>
                                    <span>{task.title}</span>
                                    <span>{task.isCompleted === true ? "Complete" : "Not Completed"}</span>
                                    <Button sx={{ alignSelf: 'flex-start', paddingTop: '5px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }} onClick={() => navigate(`/task-page/${task._id}`)}><VisibilityIcon /></Button>
                                    <Button sx={{ alignSelf: 'flex-start', paddingTop: '5px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }} onClick={() => dispatch(deleteTask({ taskId: task._id, roomId }))}><DeleteIcon /></Button>
                                </div>
                            ))
                            :
                            <></>
                    }

                </div>

            </div>

        </div>
    )
}

export default Task