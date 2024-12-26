import React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { Box, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

function ResetPassword() {
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [resetLoading, setResetLoading] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const handleReset = () => {
        setResetLoading(true);
    }
    return (
        <div className='reset-password-container' style={{ backgroundColor: '#2a2a2a', borderRadius: '5px' }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    width: '400px',
                    height: '230px',
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
        </div>
    )
}

export default ResetPassword
