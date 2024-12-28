import React from 'react'
import NavHeader from '../../components/navHeader/NavHeader'
import Sider from '../../components/sider/Sider'
import RequestedRoomsContent from './requestedRoomsContent/RequestedRoomsContent'

function RequestedRooms() {
  return (
    <>
        <NavHeader/>
        <div style={{display: 'flex'}}>
            <Sider/>
            <RequestedRoomsContent/>
        </div>
    </>
  )
}

export default RequestedRooms