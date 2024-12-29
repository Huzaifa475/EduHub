import React, { useEffect, useState } from 'react'
import './index.css'
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ChatIcon from '@mui/icons-material/Chat';
import VideocamIcon from '@mui/icons-material/Videocam';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddTaskIcon from '@mui/icons-material/AddTask';
import { Button, Skeleton, Stack } from '@mui/material'
import { useLocation, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoom } from '../../redux/roomSlice';

function Room() {
    const { room, loading, error } = useSelector(state => state.room)
    const { roomId } = useParams();
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchRoom({ roomId }))
    }, [dispatch])

    if (loading) {
        return (
            <Stack className='room-container'>
                <Stack className='room-content' sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Stack className="room-header">
                        <Skeleton variant='h1' sx={{ bgcolor: 'hsla(215, 15%, 40%, 0.15)', width: '90%', height: '20%' }} />
                        <Skeleton variant='h1' sx={{ bgcolor: 'hsla(215, 15%, 40%, 0.15)', width: '90%', height: '20%' }} />
                        <Skeleton variant='h1' sx={{ bgcolor: 'hsla(215, 15%, 40%, 0.15)', width: '90%', height: '20%' }} />
                        <Skeleton variant='h1' sx={{ bgcolor: 'hsla(215, 15%, 40%, 0.15)', width: '90%', height: '20%' }} />
                        <Stack className="tags-container">
                            <Skeleton variant='span' sx={{ bgcolor: 'hsla(215, 15%, 40%, 0.15)' }} />
                            <Skeleton variant='span' sx={{ bgcolor: 'hsla(215, 15%, 40%, 0.15)' }} />
                            <Skeleton variant='span' sx={{ bgcolor: 'hsla(215, 15%, 40%, 0.15)' }} />
                        </Stack>
                    </Stack>
                    <Stack className="room-button">
                        <Skeleton variant='button' sx={{ bgcolor: 'hsla(215, 15%, 40%, 0.15)', width: '100%', height: '20%' }} />
                        <br />
                        <Skeleton variant='button' sx={{ bgcolor: 'hsla(215, 15%, 40%, 0.15)', width: '100%', height: '20%' }} />
                    </Stack>
                </Stack>
                <Stack className="room-cards" sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Stack className="card" sx={{ bgcolor: 'hsla(215, 15%, 40%, 0.15)' }}>
                        <Skeleton variant='h1' />
                    </Stack>
                    <Stack className="card" sx={{ bgcolor: 'hsla(215, 15%, 40%, 0.15)' }}>
                        <Skeleton variant='h1' />
                    </Stack>
                    <Stack className="card" sx={{ bgcolor: 'hsla(215, 15%, 40%, 0.15)' }}>
                        <Skeleton variant='h1' />
                    </Stack>
                    <Stack className="card" sx={{ bgcolor: 'hsla(215, 15%, 40%, 0.15)' }}>
                        <Skeleton variant='h1' />
                    </Stack>
                </Stack>
            </Stack>
        )
    }

    if (error) {
        return (
            <div className='room-container'>
                <div className='room-content'>
                    <div className="room-header">
                        <h1>Some Error Occured</h1>
                    </div>
                    <div className="room-button">
                        <Button><ExitToAppIcon />Leave Room</Button>
                        <Button><DashboardIcon />Admin Dashboard</Button>
                    </div>
                </div>
                <div className="room-cards">
                    <div className="chat-card card">
                        <h1>Chat</h1>
                        <Button><ChatIcon />Chat</Button>
                    </div>
                    <div className="file-card card">
                        <h1>File</h1>
                        <Button><UploadFileIcon />File</Button>
                    </div>
                    <div className="task-card card">
                        <h1>Tasks</h1>
                        <Button><AddTaskIcon />Task</Button>
                    </div>
                    <div className="video-card card">
                        <h1>Video</h1>
                        <Button><VideocamIcon />Video</Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='room-container'>
            <div className='room-content'>
                <div className="room-header">
                    <h1>{room.name}</h1>
                    <span>{room.description}</span>
                    <span>Room Type: {room.publicOrPrivate}</span>
                    <div className="tags-container">
                        <span style={{ display: 'inline' }}>Tags:</span>
                        {room.tags && room.tags.map((tag, index) => (
                            <span key={index} className="tag"> #{tag} </span>
                        ))}
                    </div>
                </div>
                <div className="room-button">
                    <Button><ExitToAppIcon />Leave Room</Button>
                    <Button><DashboardIcon />Admin Dashboard</Button>
                </div>
            </div>
            <div className="room-cards">
                <div className="chat-card card">
                    <h1>Chat</h1>
                    <Button><ChatIcon />Chat</Button>
                </div>
                <div className="file-card card">
                    <h1>File</h1>
                    <Button><UploadFileIcon />File</Button>
                </div>
                <div className="task-card card">
                    <h1>Tasks</h1>
                    <Button><AddTaskIcon />Task</Button>
                </div>
                <div className="video-card card">
                    <h1>Video</h1>
                    <Button><VideocamIcon />Video</Button>
                </div>
            </div>
        </div>
    )
}

export default Room