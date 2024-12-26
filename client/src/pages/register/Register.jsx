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
import './index.css';

function Register() {
    const [showPassword, setShowPassword] = React.useState(false);
    const [signUpLoading, setSignUpLoading] = React.useState(false);
    const [googleLoading, setGoogleLoading] = React.useState(false);
    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const handleSignUp = () => {
        setSignUpLoading(true)
    }

    const handleGoogle = () => {
        setGoogleLoading(true);
    }

    const handleLoginRedirect = () => {
        navigate('/')
    }

    return (
        <div className='signup-main-container' style={{backgroundColor: '#2a2a2a', borderRadius: '5px'}}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    width: '400px',
                    height: '400px',
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
        </div>
    );
}

export default Register;