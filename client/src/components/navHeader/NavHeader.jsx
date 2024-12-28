import React, { useState } from 'react';
import { useLocation } from "react-router-dom";
import { useEffect } from 'react';
import './index.css';

function NavHeader() {
  const [userName, setUserName] = useState(localStorage.getItem('userName'))
  const location = useLocation();
  
  useEffect(() => {
    if(!userName){
      const params = new URLSearchParams(location.search);
      const name = params.get('login');
      if(name){
        localStorage.setItem('userName', name);
        setUserName(name);
      }
    }
  }, [location, userName]);
  return (
    <div className='nav-header-container'>
      <h3>
        {userName?.toUpperCase()}
      </h3>
    </div>
  )
}

export default NavHeader