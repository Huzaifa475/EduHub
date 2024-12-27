import React from 'react'
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import './index.css'

function ProfileContent() {
  return (
    <div className='profile-container'>
        <div className='profile-header'>
            <h1>
                User Profile
            </h1>
        </div>
        <div className="profile-content">
            <div className="profile-avatar">
                <Avatar sx={{ bgcolor: deepPurple[500] }}>User</Avatar>
            </div>
        </div>
    </div>
  )
}

export default ProfileContent