import React, { useState } from 'react'
import './index.css'
import { Autocomplete, Chip, Fab, FormControl, FormControlLabel, FormLabel, InputAdornment, InputLabel, OutlinedInput, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import { useDispatch } from 'react-redux';
import { createRoom } from '../../../redux/roomSlice';

function CreatePage() {
    const [tags, setTags] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [roomType, setRoomType] = useState('public');
    const dispatch = useDispatch()

    const handleClickCreate = () => {
        dispatch(createRoom({name, description, roomType, tags}));
        setTags('')
        setName('')
        setDescription('')
        setRoomType('public')
    }

    const handleRoomTypeChange = (event) => {
        setRoomType(event.target.value);
    };

    return (
        <div className='create-container'>

            <div className="create-header">
                <h1>Create new room</h1>
            </div>

            <div className="create-content">
                <FormControl fullWidth sx={{ width: '98%' }}>
                    <OutlinedInput
                        startAdornment={
                            <InputAdornment position="start">
                                <span style={{ color: '#66b3ff' }}>Name</span>
                            </InputAdornment>
                        }
                        sx={{
                            bgcolor: 'hsla(215, 15%, 40%, 0.15)',
                            width: '98%',
                            '& .MuiOutlinedInput-input': {
                                color: '#66b3ff'
                            },
                        }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </FormControl>

                <FormControl fullWidth sx={{ width: '98%' }}>
                    <OutlinedInput
                        multiline
                        rows={3}
                        startAdornment={
                            <InputAdornment position="start">
                                <span style={{ color: '#66b3ff' }}>Description</span>
                            </InputAdornment>
                        }
                        sx={{
                            bgcolor: 'hsla(215, 15%, 40%, 0.15)',
                            width: '98%',
                            '& .MuiOutlinedInput-input': {
                                color: '#66b3ff'
                            },
                        }}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </FormControl>

                <Autocomplete
                    multiple
                    freeSolo
                    options={[]}
                    value={tags}
                    onChange={(event, newValue) => setTags(newValue)}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => {
                            const { key, ...tagProps } = getTagProps({ index });
                            return (
                                <Chip
                                    key={key}
                                    label={option}
                                    {...tagProps}
                                    sx={{ color: '#fff', bgcolor: '#66b3ff' }}
                                />
                            );
                        })
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label="Tags"
                            sx={{
                                width: '98%',
                                bgcolor: 'hsla(215, 15%, 40%, 0.15)',
                                '& .MuiInputLabel-root': { color: '#66b3ff' },
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': { borderColor: '#66b3ff' },
                                },
                            }}
                        />
                    )}
                    sx={{ width: '98%', input: { color: '#66b3ff' } }}
                />

                <FormControl component="fieldset" sx={{ color: '#66b3ff' }}>
                    <Typography variant="h6" sx={{ color: '#66b3ff', mb: 1 }}>Select Room Type</Typography>
                    <RadioGroup
                        row
                        value={roomType}
                        onChange={handleRoomTypeChange}
                        name="roomType"
                    >
                        <FormControlLabel
                            value="public"
                            control={<Radio sx={{ color: '#66b3ff', '&.Mui-checked': { color: '#66b3ff' } }} />}
                            label="Public"
                            sx={{ color: '#66b3ff' }}
                        />
                        <FormControlLabel
                            value="private"
                            control={<Radio sx={{ color: '#66b3ff', '&.Mui-checked': { color: '#66b3ff' } }} />}
                            label="Private"
                            sx={{ color: '#66b3ff' }}
                        />
                    </RadioGroup>
                </FormControl>

                <Fab color="primary" aria-label="add" sx={{justifySelf: 'flex-end', alignSelf: 'flex-end'}} onClick={handleClickCreate}>
                    <AddIcon />
                </Fab>
            </div>
        </div>
    )
}

export default CreatePage