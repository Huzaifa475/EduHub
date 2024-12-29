import React, { useEffect } from 'react'
import './index.css'
import { useDispatch, useSelector } from 'react-redux'
import { Skeleton, Stack } from '@mui/material'
import { fecthRooms } from '../../../redux/roomSlice'
import { useNavigate } from 'react-router'

function RoomsContent() {
    const { rooms, loading, error } = useSelector(state => state.room)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(fecthRooms())
    }, [dispatch])

    if (loading) {
        return (
            <div className='rooms-container'>
                <div className='rooms-header'>
                    <h1>
                        Rooms
                    </h1>
                </div>
                <Stack className='rooms-content'>
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
            <div className='rooms-container'>
                <div className='rooms-header'>
                    <h1>
                        Rooms
                    </h1>
                </div>
                <div className='rooms-content'>
                    <div className="room">
                        <h1>Server Error</h1>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className='rooms-container'>

            <div className='rooms-header'>
                <h1>
                    Rooms
                </h1>
            </div>

            <div className='rooms-content'>

                {
                    rooms && rooms.length > 0 ? (
                        rooms.map((room) => (
                            <div className="room" key={room._id} onClick={() => navigate(`/room/${room._id}`)}>
                                <h1>Room: {room.name}</h1>
                                <h1>Description: {room.description}</h1>
                                <h1>Mode: {room.publicOrPrivate}</h1>
                            </div>
                        ))
                    )
                        :
                        (
                            <div>Currently you are not in any Room</div>
                        )
                }

            </div>

        </div>
    )
}

export default RoomsContent