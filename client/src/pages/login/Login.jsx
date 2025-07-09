import React from 'react';
import Box from '@mui/material/Box';
import { Button, TextField, Typography } from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import GoogleIcon from '@mui/icons-material/Google';
import LoadingButton from '@mui/lab/LoadingButton';
import { useNavigate } from 'react-router';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

function Login() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [logInLoading, setLogInLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [userNameOrEmail, setUserNameOrEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleGoogle = () => {
    setGoogleLoading(true);
    try {
      window.location.href = 'https://eduhub-aj7z.onrender.com/api/v1/users/google-login'
    } catch (error) {
      if (error.response) {
        if (error.response?.data?.message)
          toast.error(error.response?.data?.message, { duration: 1000 });
        else
          toast.error(error.request?.statusText, { duration: 1000 });
      }
      else if (error.request) {
          toast.error(error.request?.statusText, { duration: 1000 });
      }
    } finally {
      setGoogleLoading(false);
    }
  }

  const handleSignUpRedirect = () => {
    navigate('/signup')
  }

  const handleForgotPassword = () => {
    navigate('/forgot-password')
  }

  const handleLogIn = async () => {
    let res
    try {
      res = await axios({
        method: 'post',
        url: '/api/v1/users/login',
        data: {
          userName: userNameOrEmail,
          email: userNameOrEmail,
          password: password
        }
      })
      toast.success(res?.data?.message, { duration: 1000 })
      const accessToken = res?.data?.data?.accessToken
      const userName = res?.data?.data?.user?.userName
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('userName', userName);
      setTimeout(() => {
          navigate('/home', { replace: true })
      }, 500)
    } catch (error) {
      if (error.response) {
        if (error.response?.data?.message)
          toast.error(error.response?.data?.message, { duration: 1000 });
        else
          toast.error(error.request?.statusText, { duration: 1000 });
      }
      else if (error.request) {
          toast.error(error.request?.statusText, { duration: 1000 });
      }
    } finally {
      setUserNameOrEmail('')
      setPassword('')
      setLogInLoading(false)
    }
  }
  return (
    <div className='login-container' style={{ backgroundColor: '#2a2a2a', borderRadius: '5px', width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '400px',
          height: '440px',
          margin: '0 auto',
          padding: '2rem',
          boxShadow: 3,
          borderRadius: '8px'
        }}
        component="form"
        noValidate
        autoComplete="off"
      >
        <Typography variant="h5" sx={{ textAlign: 'center', color: '#1560bd' }}>
          Log In
        </Typography>
        <FormControl>
          <TextField
            label="UserName or Email"
            sx={{
              input: { color: 'white' },
              label: { color: 'grey' },
              bgcolor: 'black',
              borderRadius: '4px'
            }}
            value={userNameOrEmail}
            onChange={(e) => setUserNameOrEmail(e.target.value)}
          />
        </FormControl>
        <FormControl variant="outlined">
          <InputLabel
            htmlFor="outlined-adornment-password"
            sx={{
              color: 'grey'
            }}
          >
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? 'hide the password' : 'display the password'}
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                  sx={{
                    color: 'grey',
                  }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
            sx={{
              bgcolor: 'black',
              color: 'white',
              borderRadius: '4px'
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem' }}>
          <Button
            variant="text"
            sx={{ textTransform: 'none', color: '#1976d2' }}
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </Button>
        </Box>
        <LoadingButton
          loading={logInLoading}
          variant="outlined"
          onClick={handleLogIn}
          sx={{
            backgroundColor: '#1976d2',
            color: '#fff',
            '&:hover': { backgroundColor: '#1560bd' },
          }}
        >
          Log In
        </LoadingButton>
        <LoadingButton
          loading={googleLoading}
          variant="outlined"
          onClick={handleGoogle}
          startIcon={<GoogleIcon />}
          sx={{
            backgroundColor: '#002D62',
            color: '#fff',
            '&:hover': { backgroundColor: '#002D88' },
          }}
        >
          Continue with Google
        </LoadingButton>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Don't Have an Account?
          </Typography>
          <Button
            variant="text"
            sx={{ textTransform: 'none', color: '#1976d2' }}
            onClick={handleSignUpRedirect}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
      <Toaster/>
    </div>
  )
}

export default Login
