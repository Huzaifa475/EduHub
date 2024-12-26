import React from 'react';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import GroupIcon from '@mui/icons-material/Group';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import './index.css'
import { Box } from '@mui/material';


function Sider() {

  return (
    <>
      <Divider />
      <div className='sider-container'>
        <button><HomeIcon/>Home</button>
        <button><SearchIcon/>Serach</button>
        <button><GroupIcon/>Rooms</button>
        <button><GroupAddIcon/>Request</button>
        <button><NotificationsNoneIcon/>Notifications</button>
        <button><PersonIcon/>Profile</button>
        <button><LogoutIcon/>Logout</button>
      </div>
    </>
  )
}

export default Sider
