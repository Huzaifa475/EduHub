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
import './index.css';

function Register() {
    const [showPassword, setShowPassword] = React.useState(false);
    const [signUpLoading, setSignUpLoading] = React.useState(false);
    const [googleLoading, setGoogleLoading] = React.useState(false);
    const [userName, setUserName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    axios.defaults.withCredentials = true;
    const handleSignUp = async () => {
        setSignUpLoading(true)
        let res
        try {
            res = await axios({
                method: 'post',
                url: '/api/v1/users/register',
                data: {
                    userName,
                    email,
                    password
                }
            })
            toast.success(res?.data?.message, { duration: 1000 })
            setTimeout(() => {
                navigate('/', { replace: true })
            }, 500)
        } catch (error) {
            if (error.response) {
                if (error.response?.data?.message)
                    toast.error(error.response?.data?.message, {duration: 1000});
                else
                    toast.error(error.request?.statusText, {duration: 1000});
            }
            else if (error.request) {
                toast.error(error.request?.statusText, {duration: 1000});
            }
        } finally {
            setUserName('')
            setEmail('')
            setPassword('')
            setSignUpLoading(false)
        }
    }

    const handleGoogle = async() => {
        setGoogleLoading(true);
        try {
            window.location.href = 'https://eduhub-aj7z.onrender.com/api/v1/users/google-login'
        } catch (error) {
            if (error.response) {
                if (error.response?.data?.message)
                    toast.error(error.response?.data?.message, {duration: 1000});
                else
                    toast.error(error.request?.statusText, {duration: 1000});
            }
            else if (error.request) {
                toast.error(error.request?.statusText, {duration: 1000});
            }
        } finally {
            setGoogleLoading(false);
        }
    }

    const handleLoginRedirect = () => {
        navigate('/')
    }

    return (
        <div className='signup-container' style={{ backgroundColor: '#2a2a2a', borderRadius: '5px', width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    width: '400px',
                    height: '450px',
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
                    Sign Up
                </Typography>
                <FormControl>
                    <TextField
                        label="User Name"
                        sx={{
                            input: { color: 'white' },
                            label: { color: 'grey' },
                            bgcolor: 'black',
                            borderRadius: '4px'
                        }}
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label="Email"
                        type="email"
                        sx={{
                            input: { color: 'white' },
                            label: { color: 'grey' },
                            bgcolor: 'black',
                            borderRadius: '4px'
                        }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                <LoadingButton
                    loading={signUpLoading}
                    variant="outlined"
                    onClick={handleSignUp}
                    sx={{
                        backgroundColor: '#1976d2',
                        color: '#fff',
                        '&:hover': { backgroundColor: '#1560bd' },
                    }}
                >
                    Sign Up
                </LoadingButton>
                {/* <LoadingButton
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
                </LoadingButton> */}
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                        Already have an account?
                    </Typography>
                    <Button
                        variant="text"
                        sx={{ textTransform: 'none', color: '#1976d2' }}
                        onClick={handleLoginRedirect}
                    >
                        Log In
                    </Button>
                </Box>
            </Box>
            <Toaster />
        </div>
    );
}

export default Register;