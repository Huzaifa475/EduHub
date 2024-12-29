import {Route, Routes} from 'react-router-dom'
import Login from './pages/login/Login.jsx'
import Register from './pages/register/Register.jsx'
import ForgotPassword from './pages/forgotPassword/ForgotPassword.jsx'
import ResetPassword from './pages/resetPassword/ResetPassword.jsx'
import Notification from './pages/notification/Notification.jsx'
import Profile from './pages/profile/Profile.jsx'
import Rooms from './pages/rooms/Rooms.jsx'
import RequestedRooms from './pages/requestedRooms/RequestedRooms.jsx'
import Create from './pages/create/Create.jsx'
import Search from './pages/search/Search.jsx'
import './App.css'
import Room from './pages/room/Room.jsx'
import Admin from './pages/admin/Admin.jsx'
import SearchRoom from './pages/searchRoom/SearchRoom.jsx'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/signup' element={<Register/>}/>
      <Route path='/forgot-password' element={<ForgotPassword/>}/>
      <Route path='/reset-password/:token' element={<ResetPassword/>}/>
      <Route path='/home' element={<Search/>}/>
      <Route path='/notification' element={<Notification/>}/>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/rooms' element={<Rooms/>}/>
      <Route path='/requested-rooms' element={<RequestedRooms/>}/>
      <Route path='/create' element={<Create/>}/>
      <Route path='/room/:roomId' element={<Room/>}/>
      <Route path='/admin/:roomId' element={<Admin/>}/>
      <Route path='/search/:roomId' element={<SearchRoom/>}/>
    </Routes>
  )
}

export default App