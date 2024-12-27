import React, { useEffect } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import './index.css'
import { useDispatch, useSelector } from 'react-redux';
import { deleteNotification, deleteNotifications, fetchNotifications } from '../../../redux/notificationSlice';
import { Skeleton, Stack } from '@mui/material';

function NotificationContent() {
    const { notification, loading, error } = useSelector(state => state.notification)
    const dispatch = useDispatch()
    
    useEffect(() => {
        dispatch(fetchNotifications())
    }, [dispatch])

    const handleClickClear = () => {
        dispatch(deleteNotifications())
    }

    if (loading) {
        return (
            <div className='notification-container'>
                <div className='notification-header'>
                    <h1>
                        Notifications
                    </h1>
                    <button>
                        Clear Notifications
                    </button>
                </div>
                <Stack className="notification-content">
                    <Skeleton className='notification' sx={{backgroundColor: 'hsla(215, 15%, 40%, 0.15)'}}/>
                    <Skeleton className='notification' sx={{backgroundColor: 'hsla(215, 15%, 40%, 0.15)'}}/>
                    <Skeleton className='notification' sx={{backgroundColor: 'hsla(215, 15%, 40%, 0.15)'}}/>
                    <Skeleton className='notification' sx={{backgroundColor: 'hsla(215, 15%, 40%, 0.15)'}}/>
                    <Skeleton className='notification' sx={{backgroundColor: 'hsla(215, 15%, 40%, 0.15)'}}/>
                    <Skeleton className='notification' sx={{backgroundColor: 'hsla(215, 15%, 40%, 0.15)'}}/>
                    <Skeleton className='notification' sx={{backgroundColor: 'hsla(215, 15%, 40%, 0.15)'}}/>
                    <Skeleton className='notification' sx={{backgroundColor: 'hsla(215, 15%, 40%, 0.15)'}}/>
                    <Skeleton className='notification' sx={{backgroundColor: 'hsla(215, 15%, 40%, 0.15)'}}/>
                    <Skeleton className='notification' sx={{backgroundColor: 'hsla(215, 15%, 40%, 0.15)'}}/>
                </Stack>
            </div>
        )
    }

    if (error) {
        return (
            <div className='notification-container'>
                <div className='notification-header'>
                    <h1>
                        Notifications
                    </h1>
                    <button>
                        Clear Notifications
                    </button>
                </div>
                <div className="notification-content">
                    Something went wrong
                </div>
            </div>
        )
    }
    return (
        <div className='notification-container'>
            <div className='notification-header'>
                <h1>
                    Notifications
                </h1>
                <button onClick={handleClickClear}>
                    Clear Notifications
                </button>
            </div>
            <div className="notification-content">
                {
                    notification && notification.length > 0 ? (
                        notification.map((notification) => {
                            <div className='notification' key={notification._id}>
                                <h1>{notification.content}</h1>
                                <div className="notification-button">
                                    <p>{moment(notification.createdAt).format('LLL')}</p>
                                    <button onClick={() => dispatch(deleteNotification(notification._id))}>
                                        <DeleteIcon />
                                    </button>
                                </div>
                            </div>
                        })
                    )
                        :
                        (
                            <div>No notification to display</div>
                        )
                }
            </div>
        </div>
    )
}

export default NotificationContent
