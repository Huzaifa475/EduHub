import React from 'react'
import NavHeader from '../../components/navHeader/NavHeader'
import Sider from '../../components/sider/Sider'
import SearchContent from './searchContent/SearchContent'

function Search() {
  return (
    <>
        <NavHeader/>
        <div style={{display: 'flex'}}>
            <Sider/>
            <SearchContent/>
        </div>
    </>
  )
}

export default Search