import React, { useEffect, useState } from 'react'
import './index.css'
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { Button, Skeleton, Stack } from '@mui/material'
import { useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoom, requestToRoom, roomStatus } from '../../redux/roomSlice';

function SearchRoom() {
    const { searchRoom, loading, error } = useSelector(state => state.room)
    const { roomId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(roomStatus({ roomId }))
    }, [dispatch])

    useEffect(() => {
        if (searchRoom?.status === 'member') {
            navigate(`/room/${roomId}`, {replace: true});
        }
    }, [searchRoom?.status, navigate, roomId]);

    const handleClickRequest = async () => {
        dispatch(requestToRoom({ roomId }))
    }

    if (loading) {
        return (
            <Stack className='search-room-container'>
                <Stack className='search-room-content' sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Stack className="search-room-header">
                        <Skeleton variant='h1' sx={{ bgcolor: 'hsla(215, 15%, 40%, 0.15)', width: '90%', height: '20%' }} />
                        <Skeleton variant='h1' sx={{ bgcolor: 'hsla(215, 15%, 40%, 0.15)', width: '90%', height: '20%' }} />
                        <Skeleton variant='h1' sx={{ bgcolor: 'hsla(215, 15%, 40%, 0.15)', width: '90%', height: '20%' }} />
                        <Skeleton variant='h1' sx={{ bgcolor: 'hsla(215, 15%, 40%, 0.15)', width: '90%', height: '20%' }} />
                    </Stack>
                </Stack>
            </Stack>
        )
    }

    if (error) {
        return (
            <div className='search-room-container'>
                <div className='search-room-content'>
                    <div className="search-room-header">
                        <h1>Some Error Occured</h1>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='search-room-container'>
            <div className='search-room-content'>
                <div className="search-room-header">
                    <h1>{searchRoom?.room?.name}</h1>
                    <span>{searchRoom?.room?.description}</span>
                    <span>Room Type: {searchRoom?.room?.publicOrPrivate}</span>
                    <div className="tags-container">
                        <span style={{ display: 'inline' }}>Tags:</span>
                        {searchRoom?.room?.tags && searchRoom?.room?.tags.map((tag, index) => (
                            <span key={index} className="tag"> #{tag} </span>
                        ))}
                    </div>
                    <br />
                    {
                        searchRoom?.status === 'null' ?
                        <Button sx={{ color: 'black', bgcolor: '#66b3ff' }} onClick={handleClickRequest}><GroupAddIcon />Request</Button>
                        :
                        <Button sx={{ color: 'black', bgcolor: '#0080ff' }} onClick={handleClickRequest}><GroupAddIcon />Requested</Button>
                    }
                </div>
            </div>
        </div>
    )
}

export default SearchRoom