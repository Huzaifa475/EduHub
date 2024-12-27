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
import LoginIcon from '@mui/icons-material/Login';
import './index.css'
import { Box } from '@mui/material';
import { useNavigate } from 'react-router';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';


function Sider() {
  const accessToken = localStorage.getItem('accessToken')
  const navigate = useNavigate()

  const handleClickHome = () => {
    navigate('/home')
  }

  const handleClickSearch = () => {
    navigate('/search')
  }

  const handleClickGroup = () => {
    navigate('/rooms')
  }

  const handleClickGroupAdd = () => {
    navigate('/requested-rooms')
  }

  const handleClickNotification = () => {
    navigate('/notification')
  }

  const handleClickPerson = () => {
    navigate('/profile')
  }

  const handleClickLogOut = async() => {
    let res
    let toastId
    try {
      res = await axios({
        method: 'post',
        url: '/api/v1/users/logout'
      })
      toastId = toast.success(res?.data?.message, { duration: 1000 })
      localStorage.clear();
      navigate('/')
    } catch (error) {
      if (error.response) {
        if (error.response?.data?.message)
          toastId = toast.error(error.response?.data?.message, { duration: 1000 });
        else
          toastId = toast.error(error.request?.statusText, { duration: 1000 });
      }
      else if (error.request) {
        toastId = toast.error(error.request?.statusText, { duration: 1000 });
      }
    } finally {
      toast.dismiss(toastId)
    }
  }

  const handleClickLogIn = () => {
    navigate('/')
  }
  return (
    <>
      <Divider />
      <div className='sider-container'>
        <button onClick={handleClickHome}><HomeIcon/>Home</button>
        <button onClick={handleClickSearch}><SearchIcon/>Serach</button>
        <button onClick={handleClickGroup}><GroupIcon/>Rooms</button>
        <button onClick={handleClickGroupAdd}><GroupAddIcon/>Request</button>
        <button onClick={handleClickNotification}><NotificationsNoneIcon/>Notifications</button>
        <button onClick={handleClickPerson}><PersonIcon/>Profile</button>
        {
          accessToken ?
          <button onClick={handleClickLogOut}><LogoutIcon/>LogOut</button>
          :
          <button onClick={handleClickLogIn}><LoginIcon/>LogIn</button>
        }
      </div>
      <Toaster/>
    </>
  )
}

export default Sider
