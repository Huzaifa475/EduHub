import React from 'react';
import NavHeader from '../../components/navHeader/NavHeader.jsx';
import Slider from '../../components/sider/Sider.jsx';

function Home() {
  return (
    <>
        <NavHeader/>
        <div className='home-container'>
            <Slider/>
        </div>
    </>
  )
}

export default Home
