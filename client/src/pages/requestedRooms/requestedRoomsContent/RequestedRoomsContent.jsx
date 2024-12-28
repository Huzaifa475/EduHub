import React, { useEffect } from 'react'
import './index.css'
import { useDispatch, useSelector } from 'react-redux'
import { Skeleton, Stack } from '@mui/material'
import { fetchRequestedRooms } from '../../../redux/roomSlice'

function RequestedRoomsContent() {
    const { requestedRooms, loading, error } = useSelector(state => state.room)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchRequestedRooms())
    }, [dispatch])

    if (loading) {
        return (
            <div className='requested-rooms-container'>
                <div className='requested-rooms-header'>
                    <h1>
                        Requested Rooms
                    </h1>
                </div>
                <Stack className='requested-rooms-content'>
                    <Skeleton sx={{ backgroundColor: 'hsla(215, 15%, 40%, 0.15)', height: '100px' }} />
                    <Skeleton sx={{ backgroundColor: 'hsla(215, 15%, 40%, 0.15)', height: '100px' }} />
                    <Skeleton sx={{ backgroundColor: 'hsla(215, 15%, 40%, 0.15)', height: '100px' }} />
                    <Skeleton sx={{ backgroundColor: 'hsla(215, 15%, 40%, 0.15)', height: '100px' }} />
                </Stack>
            </div>
        )
    }

    if (error) {
        return (
            <div className='requested-rooms-container'>
                <div className='requested-rooms-header'>
                    <h1>
                        Requested Rooms
                    </h1>
                </div>
                <div className='requested-rooms-content'>
                    <div className="requested-room">
                        <h1>Server Error</h1>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='requested-rooms-container'>

            <div className='requested-rooms-header'>
                <h1>
                    Requested Rooms
                </h1>
            </div>

            <div className='requested-rooms-content'>

                {
                    requestedRooms && requestedRooms.length > 0 ? (
                        requestedRooms.map((room) => (
                            <div className="room" key={room._id}>
                                <h1>Room: {room.name}</h1>
                                <h1>Description: {room.description}</h1>
                                <h1>Mode: {room.publicOrPrivate}</h1>
                            </div>
                        ))
                    )
                        :
                        (
                            <div>Currently you have not requested for a Room</div>
                        )
                }

            </div>

        </div>
    )
}

export default RequestedRoomsContent