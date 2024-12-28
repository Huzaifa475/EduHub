import React from 'react'
import NavHeader from '../../components/navHeader/NavHeader'
import Sider from '../../components/sider/Sider'
import RoomsContent from './roomsContent/RoomsContent'

function Rooms() {
  return (
    <>
      <NavHeader/>
      <div style={{display: 'flex'}}>
        <Sider/>
        <RoomsContent/>
      </div>
    </>
  )
}

export default Rooms