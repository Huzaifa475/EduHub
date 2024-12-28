import React, { useEffect, useState } from 'react';
import Divider from '@mui/material/Divider';
import SearchIcon from '@mui/icons-material/Search';
import GroupIcon from '@mui/icons-material/Group';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import QueueIcon from '@mui/icons-material/Queue'
import { useNavigate } from 'react-router';
import toast, { Toaster } from 'react-hot-toast';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import './index.css'


function Sider() {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'))
  const navigate = useNavigate()
  const location = useLocation();

  const handleClickSearch = () => {
    navigate('/home')
  }

  const handleClickCreate = () => {
    navigate('/create')
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

  const handleClickLogOut = async () => {
    let res
    let toastId
    try {
      res = await axios({
        method: 'post',
        url: '/api/v1/users/logout',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
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

  useEffect(() => {
    if (!accessToken) {
      const params = new URLSearchParams(location.search);
      const tokenFromURL = params.get('accessToken');
      if (tokenFromURL) {
        localStorage.setItem('accessToken', tokenFromURL);
        setAccessToken(tokenFromURL);
      }
    }
  }, [location, accessToken])
  return (
    <>
      <Divider />
      <div className='sider-container'>
        <button onClick={handleClickSearch}><SearchIcon />Serach</button>
        <button onClick={handleClickCreate}><QueueIcon />Create Room</button>
        <button onClick={handleClickGroup}><GroupIcon />Rooms</button>
        <button onClick={handleClickGroupAdd}><GroupAddIcon />Requests</button>
        <button onClick={handleClickNotification}><NotificationsNoneIcon />Notifications</button>
        <button onClick={handleClickPerson}><PersonIcon />Profile</button>
        {
          accessToken ?
            <button onClick={handleClickLogOut}><LogoutIcon />LogOut</button>
            :
            <button onClick={handleClickLogIn}><LoginIcon />LogIn</button>
        }
      </div>
      <Toaster />
    </>
  )
}

export default Sider