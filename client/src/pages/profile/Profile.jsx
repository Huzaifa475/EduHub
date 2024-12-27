import React from 'react'
import NavHeader from '../../components/navHeader/NavHeader'
import Sider from '../../components/sider/Sider'
import ProfileContent from './profileContent/ProfileContent'

function Profile() {
  return (
    <>
        <NavHeader/>
        <div style={{display: 'flex'}}>
            <Sider/>
            <ProfileContent/>
        </div>
    </>
  )
}

export default Profile
