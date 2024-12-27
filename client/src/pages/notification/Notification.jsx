import React from 'react'
import NavHeader from '../../components/navHeader/NavHeader'
import Sider from '../../components/sider/Sider'
import NotificationContent from './notificationContent/NotificationContent'

function Notification() {
  return (
    <>
        <NavHeader/>
        <div style={{display: 'flex'}}>
            <Sider/>
            <NotificationContent/>
        </div>
    </>
  )
}

export default Notification