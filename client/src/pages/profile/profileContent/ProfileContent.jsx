import React, { useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar';
import { deepPurple } from '@mui/material/colors';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import './index.css'
import { fetchProfile, updateProfile } from '../../../redux/profileSlice';
import toast from 'react-hot-toast';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function ProfileContent() {
    const [nameText, setNameText] = useState(false);
    const [emailText, setEmailText] = useState(false);
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [selectedFile, setSelectedFile] = useState(null);
    const { profile, loading, error } = useSelector(state => state.profile);
    const accessToken = localStorage.getItem('accessToken');
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchProfile())
    }, [dispatch])

    const handleClickName = () => {
        setNameText((prev) => !prev)
    }

    const handleClickEmail = () => {
        setEmailText((prev) => !prev)
    }

    const handleClickNameDone = () => {
        dispatch(updateProfile({ userName, email }))
        setNameText((prev) => !prev)
    }

    const handleClickEmailDone = () => {
        dispatch(updateProfile({ userName, email }))
        setEmailText((prev) => !prev)
    }

    const uploadImage = async (selectedFile) => {
        try {
            if (!selectedFile) {
                throw new Error('Select a File');
            }

            const formData = new FormData();
            formData.append('photo', selectedFile);

            const response = await fetch('/api/v1/users/upload-photo', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error('Failed to upload image', errorData);
            }
            toast.success(response.statusText)
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            uploadImage(file);
        }
    };    
    return (
        <div className='profile-container'>
            <div className='profile-header'>
                <h1>
                    User Profile
                </h1>
            </div>
            <div className="profile-content">
                <div className="profile-avatar">
                    <Avatar sx={{ bgcolor: deepPurple[500], width: '100px', height: '100px' }} src={profile.photo}>{!profile.photo && profile.userName?.charAt(0)}</Avatar>
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                        sx={{ width: '170px', height: '30px' }}
                    >
                        Upload files
                        <VisuallyHiddenInput
                            type="file"
                            multiple
                            onChange={handleFileChange}
                        />
                    </Button>
                </div>
                <div className="profile-info">
                    <div className='profile-name'>
                        {
                            nameText ?
                                <input type="text" placeholder='Enter Name...' value={userName} onChange={(e) => setUserName(e.target.value)} />
                                :
                                <h1>{profile.userName}</h1>
                        }
                        <div className='profile-buttons'>
                            {
                                nameText ?
                                    <button onClick={handleClickNameDone}>
                                        <DoneIcon />
                                    </button>
                                    :
                                    <button onClick={handleClickName}>
                                        <EditIcon />
                                    </button>
                            }
                        </div>
                    </div>
                    <div className='profile-email'>
                        {
                            emailText ?
                                <input type="email" placeholder='Enter Email...' value={email} onChange={(e) => setEmail(e.target.value)} />
                                :
                                <h1>{profile.email}</h1>
                        }
                        <div className='profile-buttons'>
                            {
                                emailText ?
                                    <button onClick={handleClickEmailDone}>
                                        <DoneIcon />
                                    </button>
                                    :
                                    <button onClick={handleClickEmail}>
                                        <EditIcon />
                                    </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileContent