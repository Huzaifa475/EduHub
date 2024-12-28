import React from 'react'
import NavHeader from '../../components/navHeader/NavHeader'
import Sider from '../../components/sider/Sider'
import CreatePage from './createPage/CreatePage'

function Create() {
  return (
    <>
        <NavHeader/>
        <div style={{display: 'flex'}}>
            <Sider/>
            <CreatePage/>
        </div>
    </>
  )
}

export default Create