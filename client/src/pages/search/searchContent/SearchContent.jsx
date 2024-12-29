import { Button, InputAdornment, Skeleton, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SearchIcon from '@mui/icons-material/Search';
import { fetchSearchRooms } from '../../../redux/roomSlice';
import { useNavigate } from 'react-router';
import { fetchProfile } from '../../../redux/profileSlice';

function SearchContent() {
    const [prompt, setPrompt] = useState('');
    const { searchRooms, loading, error } = useSelector(state => state.room);
    const { profile } = useSelector(state => state.profile)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (!profile?._id) {
            dispatch(fetchProfile());
        }
    }, [dispatch, profile?._id]);

    useEffect(() => {
        if (profile?._id) {
            localStorage.setItem('id', profile._id);
        }
    }, [profile?._id]);

    const handleClickSearch = () => {
        dispatch(fetchSearchRooms({ prompt }))
    }

    if (loading) {
        return (
            <div className='serach-container' style={{ width: '82%', height: '91.8vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="serach-field" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px', height: '10%' }}>
                    <TextField
                        label="Search"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="start">
                                    <Button onClick={handleClickSearch}>
                                        <SearchIcon sx={{ color: '#66b3ff', cursor: 'pointer' }} />
                                    </Button>
                                </InputAdornment>
                            ),
                        }}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        sx={{ marginBottom: '20px', color: '#66b3ff', backgroundColor: 'hsla(215, 15%, 40%, 0.15)', label: { color: '#66b3ff' }, width: '98%', input: { color: '#66b3ff' }, borderRadius: '5px' }}
                        autoComplete="off"
                    />
                </div>
                <Stack className='search-results' style={{ width: '100%', height: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'scroll', gap: '5px', paddingBottom: '5px', position: 'relative' }}>
                    <Skeleton className='room' style={{ width: '98%', height: '20%', display: 'flex', flexDirection: 'column', color: '#66b3ff', backgroundColor: 'hsla(215, 15%, 40%, 0.15)' }} />
                    <Skeleton className='room' style={{ width: '98%', height: '20%', display: 'flex', flexDirection: 'column', color: '#66b3ff', backgroundColor: 'hsla(215, 15%, 40%, 0.15)' }} />
                    <Skeleton className='room' style={{ width: '98%', height: '20%', display: 'flex', flexDirection: 'column', color: '#66b3ff', backgroundColor: 'hsla(215, 15%, 40%, 0.15)' }} />
                    <Skeleton className='room' style={{ width: '98%', height: '20%', display: 'flex', flexDirection: 'column', color: '#66b3ff', backgroundColor: 'hsla(215, 15%, 40%, 0.15)' }} />
                    <Skeleton className='room' style={{ width: '98%', height: '20%', display: 'flex', flexDirection: 'column', color: '#66b3ff', backgroundColor: 'hsla(215, 15%, 40%, 0.15)' }} />
                </Stack>
            </div>
        )
    }

    if (error) {
        return (
            <div className='serach-container' style={{ width: '82%', height: '91.8vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="serach-field" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px', height: '10%' }}>
                    <TextField
                        label="Search"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="start">
                                    <Button onClick={handleClickSearch}>
                                        <SearchIcon sx={{ color: '#66b3ff', cursor: 'pointer' }} />
                                    </Button>
                                </InputAdornment>
                            ),
                        }}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        sx={{ marginBottom: '20px', color: '#66b3ff', backgroundColor: 'hsla(215, 15%, 40%, 0.15)', label: { color: '#66b3ff' }, width: '98%', input: { color: '#66b3ff' }, borderRadius: '5px' }}
                    />
                </div>
                <div className='search-results' style={{ width: '100%', height: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'scroll', gap: '5px', paddingBottom: '5px', position: 'relative' }}>
                    <div className='room' style={{ width: '98%', height: 'auto', display: 'flex', flexDirection: 'column', color: '#66b3ff' }} >Error Occured</div>
                </div>
            </div>
        )
    }
    return (
        <div className='serach-container' style={{ width: '82%', height: '91.8vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            <div className="serach-field" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px', height: '10%' }}>
                <TextField
                    label="Search"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="start">
                                <Button onClick={handleClickSearch}>
                                    <SearchIcon sx={{ color: '#66b3ff', cursor: 'pointer' }} />
                                </Button>
                            </InputAdornment>
                        ),
                    }}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    sx={{ marginBottom: '20px', color: '#66b3ff', backgroundColor: 'hsla(215, 15%, 40%, 0.15)', label: { color: '#66b3ff' }, width: '98%', input: { color: '#66b3ff' }, borderRadius: '5px' }}
                />
            </div>

            <div className='search-results' style={{ width: '100%', height: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'scroll', gap: '5px', paddingBottom: '5px', position: 'relative' }}>

                {
                    searchRooms && searchRooms.length > 0 ?
                        searchRooms.map((room) => (
                            <div className='room' style={{ width: '98%', height: 'auto', display: 'flex', flexDirection: 'column', color: '#66b3ff' }} onClick={() => navigate(`/search/${room._id}`)} key={room._id}>
                                <h1>{room.name}</h1>
                                <h1>{room.description}</h1>
                            </div>
                        ))
                        :
                        (
                            <div className='room' style={{ width: '98%', height: 'auto', display: 'flex', flexDirection: 'column', color: '#66b3ff' }}>No Related Room</div>
                        )
                }
            </div>

        </div>
    )
}

export default SearchContent