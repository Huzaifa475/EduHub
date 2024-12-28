import React from 'react'
import './index.css'
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ChatIcon from '@mui/icons-material/Chat';
import VideocamIcon from '@mui/icons-material/Videocam';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddTaskIcon from '@mui/icons-material/AddTask';
import { Button } from '@mui/material'

function Room() {
  return (
    <div className='room-container'>

        <div className='room-content'>

            <div className="room-header">
                <h1>Name</h1>
                <h1>Description</h1>
                <h1>Room Type</h1>
                <h1>Tags</h1>
                <Button><GroupAddIcon/>Request</Button>
            </div>

            <div className="room-button">
                <Button><ExitToAppIcon/>Leave Room</Button>
                <Button><DashboardIcon/>Admin Dashboard</Button>
            </div>

        </div>

        <div className="room-cards">
            
            <div className="chat-card card">
                <h1>Chat</h1>
                <Button><ChatIcon/>Chat</Button>
            </div>

            <div className="file-card card">
                <h1>File</h1>
                <Button><UploadFileIcon/>File</Button>
            </div>

            <div className="task-card card">
                <h1>Tasks</h1>
                <Button><AddTaskIcon/>Task</Button>
            </div>

            <div className="video-card card">
                <h1>Video</h1>
                <Button><VideocamIcon/>Video</Button>
            </div>

        </div>

    </div>
  )
}

export default Room