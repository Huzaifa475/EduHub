import { IconButton, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import React from 'react'

function Admin() {
    return (
        <div style={{width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', padding: '10px'}}>
            <Typography sx={{color: '#66b3ff'}} variant='h4'>
                Admin Dashboard
            </Typography>
            <List sx={{ width: '100%', bgcolor: '#66b3ff', borderRadius: '2px' }}>
                {[0, 1, 2, 3].map((value) => {
                    const labelId = `checkbox-list-label-${value}`;
                    return (
                        <ListItem
                            key={value}
                            secondaryAction={
                                <IconButton edge="end" aria-label="comments">
                                    <PersonRemoveIcon />
                                </IconButton>
                            }
                            disablePadding
                            // sx={{borderBottom: '1px solid black'}}
                        >
                            <ListItemButton role={undefined} dense>
                                <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </div>
    )
}

export default Admin