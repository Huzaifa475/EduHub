import { Box, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

function ForgotPassword() {
    const [email, setEmail] = useState('');

    const handleResetPassword = async () => {
        let res
        try {
            res = await axios({
                method: 'post',
                url: '/api/v1/users/forgot-password',
                data: {
                    email
                }
            })
            toast.success(res?.data?.message, { duration: 1000 })
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
            setEmail('')
        }
        window.location.href = 'https://mail.google.com';
    }
    return (
        <div className="forgot-password-container" style={{ backgroundColor: '#2a2a2a', borderRadius: '5px', width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '1rem',
                    width: '450px',
                    height: '150px',
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
                <Paper
                    sx={{
                        p: '2px 4px',
                        display: 'flex',
                        alignItems: 'center',
                        width: 400,
                        height: 60,
                        backgroundColor: 'black',
                    }}
                >
                    <InputBase
                        sx={{
                            ml: 1,
                            flex: 1,
                            color: 'white',
                            backgroundColor: 'black',
                            borderRadius: '4px',
                            padding: '6px 10px',
                        }}
                        placeholder="Enter your email"
                        inputProps={{ 'aria-label': 'search google maps' }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <IconButton
                        type="button"
                        sx={{
                            p: '10px',
                            outline: 'none',
                            boxShadow: 'none',
                            '&:focus': {
                                outline: '#fff',
                                boxShadow: '0 0 0 3px rgba(128, 128, 128, 0.3)',
                            }
                        }}
                        onClick={handleResetPassword}
                        aria-label="send"
                    >
                        <SendIcon sx={{ color: 'white' }} />
                    </IconButton>
                </Paper>
            </Box>
            <Toaster />
        </div>
    );
}

export default ForgotPassword;
