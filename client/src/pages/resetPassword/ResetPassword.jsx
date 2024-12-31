import React, { useEffect, useState } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { Box, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router';

function ResetPassword() {
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [resetLoading, setResetLoading] = React.useState(false);
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const { token } = useParams()
    const navigate = useNavigate()

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const handleReset = async() => {
        setResetLoading(true);
        let res 
        try {
            res = await axios({
                method: 'patch',
                url: `/api/v1/users/reset-password/${token}`,
                data: {
                    password,
                    confirmPassword
                }
            })
            toast.success(res?.data?.message, {duration: 1000})
            navigate('/')
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
            setPassword('')
            setConfirmPassword('')
            setResetLoading(false);
        }
    }
    return (
        <div className='reset-password-container' style={{ backgroundColor: '#2a2a2a', borderRadius: '5px', width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    width: '400px',
                    height: '300px',
                    margin: '0 auto',
                    padding: '2rem',
                    boxShadow: 3,
                    borderRadius: '8px',
                }}
                component="form"
                noValidate
                autoComplete="off"
            >
                <Typography variant="h5" sx={{ textAlign: 'center', color: '#1560bd' }}>
                    Forgot Password
                </Typography>

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

                <FormControl variant="outlined">
                    <InputLabel
                        htmlFor="outlined-adornment-confirm-password"
                        sx={{
                            color: 'grey'
                        }}
                    >
                        Confirm Password
                    </InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={showConfirmPassword ? 'hide the password' : 'display the password'}
                                    onClick={handleClickShowConfirmPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    onMouseUp={handleMouseUpPassword}
                                    edge="end"
                                    sx={{
                                        color: 'grey',
                                    }}
                                >
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Confirm Password"
                        sx={{
                            bgcolor: 'black',
                            color: 'white',
                            borderRadius: '4px'
                        }}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </FormControl>

                <LoadingButton
                    loading={resetLoading}
                    variant="outlined"
                    onClick={handleReset}
                    sx={{
                        backgroundColor: '#1976d2',
                        color: '#fff',
                        '&:hover': { backgroundColor: '#1560bd' },
                    }}
                >
                    Reset
                </LoadingButton>

            </Box>
            <Toaster/>
        </div>
    )
}

export default ResetPassword
