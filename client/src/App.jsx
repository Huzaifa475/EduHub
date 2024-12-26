import {Route, Routes} from 'react-router-dom'
import Login from './pages/login/Login.jsx'
import Register from './pages/register/Register.jsx'
import ForgotPassword from './pages/forgotPassword/ForgotPassword.jsx'
import ResetPassword from './pages/resetPassword/ResetPassword.jsx'
import Home from './pages/home/Home.jsx'
import './App.css'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/signup' element={<Register/>}/>
      <Route path='/forgot-password' element={<ForgotPassword/>}/>
      <Route path='/reset-password/:token' element={<ResetPassword/>}/>
      <Route path='/home' element={<Home/>}/>
    </Routes>
  )
}

export default App