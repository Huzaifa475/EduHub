import React, { useState } from 'react';
import { useLocation } from "react-router-dom";
import { useEffect } from 'react';
import './index.css';
import Cookies from 'js-cookie'

function NavHeader() {
  let accessToken = localStorage.getItem('accessToken');
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '')
  const location = useLocation();
  
  useEffect(() => {
    if(userName === ''){
      const params = new URLSearchParams(location.search);
      setUserName(params.get('login'));
    }

    if(!accessToken){
      const params = new URLSearchParams(location.search)
      accessToken = params.get('accessToken')
      localStorage.setItem('accessToken', accessToken)
      console.log(accessToken);
    }
  }, [location]);
  return (
    <div className='nav-header-container'>
      <h3>
        {userName?.toUpperCase()}
      </h3>
    </div>
  )
}

export default NavHeader