import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemButton, ListItemText, Slide, Typography } from '@mui/material';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { deleteRoom, fetchRoomMembers, fetchRoomRequests, removeAMember, requestProcess } from '../../redux/roomSlice';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


function Admin() {
    const [openDelete, setOpenDelete] = useState(false)
    const [openRemove, setOpenRemove] = useState(false)
    const [openAccept, setOpenAccept] = useState(false)
    const [openReject, setOpenReject] = useState(false)
    const { roomMembers, roomRequests, loading, error } = useSelector(state => state.room)
    const [selectedMemberId, setSelectedMemberId] = useState(null)
    const { roomId } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(fetchRoomMembers({ roomId }))
        dispatch(fetchRoomRequests({ roomId }))
    }, [dispatch])

    const handleClickDeleteClose = () => {
        setOpenDelete(false)
    }

    const handleClickRemoveOpen = (memberId) => {
        setSelectedMemberId(memberId)
        setOpenRemove(true)
    }

    const handleClickRemoveClose = () => {
        setSelectedMemberId(null)
        setOpenRemove(false)
    }

    const handleClickAcceptOpen = (memberId) => {
        setSelectedMemberId(memberId)
        setOpenAccept(true)
    }

    const handleClickAcceptClose = () => {
        setSelectedMemberId(null)
        setOpenAccept(false)
    }

    const handleClickRejectOpen = (memberId) => {
        setSelectedMemberId(memberId)
        setOpenReject(true)
    }

    const handleClickRejectClose = () => {
        setOpenReject(false)
    }

    const handleRemoveMember = () => {
        if(selectedMemberId){
            dispatch(removeAMember({roomId, memberId: selectedMemberId}));
        }
        handleClickRemoveClose();
    }

    const handleAcceptRequest = () => {
        if(selectedMemberId){
            dispatch(requestProcess({roomId, requestId: selectedMemberId, accept: true}))
        }
        handleClickAcceptClose()
    }

    const handleRejectRequest = () => {
        if(selectedMemberId){
            dispatch(requestProcess({roomId, requestId: selectedMemberId, accept: false}))
        }
        handleClickRejectClose()
    }

    return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', padding: '10px', overflowX: 'hidden' }}>

            <div style={{ width: '100%', height: '10%', display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: '#66b3ff' }} variant='h4'>
                    Admin Dashboard
                </Typography>
                <Button onClick={() => setOpenDelete(true)}>
                    <DeleteIcon />
                    Delete Room
                </Button>
                <Dialog
                    open={openDelete}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClickDeleteClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle sx={{ color: '#66b3ff', backgroundColor: 'black' }}>{"Delete Room Confirmation"}</DialogTitle>
                    <DialogContent sx={{ color: '#66b3ff', backgroundColor: 'black' }}>
                        <DialogContentText id="alert-dialog-slide-description" sx={{ color: '#66b3ff' }}>
                            Are you sure you want to delete this room? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ color: '#66b3ff', backgroundColor: 'black' }}>
                        <Button onClick={handleClickDeleteClose}>Disagree</Button>
                        <Button onClick={() => dispatch(deleteRoom({roomId, navigate}))}>Agree</Button>
                    </DialogActions>
                </Dialog>
            </div>

            <div style={{ width: '100%', height: '90%', display: 'flex', flexDirection: 'row', gap: '10px' }}>

                <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <Typography sx={{ color: '#66b3ff' }} variant='h6'>
                        Members
                    </Typography>
                    <List sx={{ width: '100%', bgcolor: '#66b3ff', borderRadius: '2px', overflowY: 'scroll' }}>
                        {roomMembers && roomMembers.length > 0 ? (
                            roomMembers.map((member) => {
                                const labelId = `checkbox-list-label-${member._id}`; 

                                return (
                                    <ListItem
                                        key={member._id}
                                        secondaryAction={
                                            <IconButton edge="end" aria-label="remove" onClick={() => handleClickRemoveOpen(member._id)}>
                                                <PersonRemoveIcon />
                                            </IconButton>
                                        }
                                        disablePadding
                                    >
                                        <ListItemButton role={undefined} dense>
                                            <ListItemText id={labelId} primary={`${member?.userName}`} />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })
                        ) : (
                            <ListItem>
                                <ListItemText primary="No members found" />
                            </ListItem>
                        )}
                    </List>

                    <Dialog
                        open={openRemove}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleClickRemoveClose}
                        aria-describedby="alert-dialog-slide-description"
                        aria-hidden={!openRemove}
                    >
                        <DialogTitle sx={{ color: '#66b3ff', backgroundColor: 'black' }}>{"Remove Member Confirmation"}</DialogTitle>
                        <DialogContent sx={{ color: '#66b3ff', backgroundColor: 'black' }}>
                            <DialogContentText id="alert-dialog-slide-description" sx={{ color: '#66b3ff' }}>
                                Are you sure you want to remove this member? This action cannot be undone.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions sx={{ color: '#66b3ff', backgroundColor: 'black' }}>
                            <Button onClick={handleClickRemoveClose}>Disagree</Button>
                            <Button onClick={handleRemoveMember}>Agree</Button>
                        </DialogActions>
                    </Dialog>
                </div>

                <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <Typography sx={{ color: '#66b3ff' }} variant='h6'>
                        Requests
                    </Typography>
                    <List sx={{ width: '100%', bgcolor: '#66b3ff', borderRadius: '2px', overflowY: 'scroll' }}>
                        {roomRequests && roomRequests.length > 0 ? (
                            roomRequests.map((request) => {
                                const labelId = `checkbox-list-label-${request._id}`;

                                return (
                                    <ListItem
                                        key={request._id}
                                        secondaryAction={
                                            <>
                                                <IconButton edge="end" aria-label="accept" onClick={() => handleClickAcceptOpen(request._id)}>
                                                    <DoneIcon />
                                                </IconButton>
                                                <IconButton edge="end" aria-label="reject" onClick={() => handleClickRejectOpen(request._id)}>
                                                    <ClearIcon />
                                                </IconButton>
                                            </>
                                        }
                                        disablePadding
                                    >
                                        <ListItemButton role={undefined} dense>
                                            <ListItemText id={labelId} primary={`${request?.userName}`} />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })
                        ) : (
                            <ListItem>
                                <ListItemText primary="No requests found" />
                            </ListItem>
                        )}
                    </List>
                    <Dialog
                        open={openAccept}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleClickAcceptClose}
                        aria-describedby="alert-dialog-slide-description"
                        aria-hidden={!openAccept}
                    >
                        <DialogTitle sx={{ color: '#66b3ff', backgroundColor: 'black' }}>{"Accept Request Confirmation"}</DialogTitle>
                        <DialogContent sx={{ color: '#66b3ff', backgroundColor: 'black' }}>
                            <DialogContentText id="alert-dialog-slide-description" sx={{ color: '#66b3ff' }}>
                                Are you sure you want to accept this request? This action cannot be undone.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions sx={{ color: '#66b3ff', backgroundColor: 'black' }}>
                            <Button onClick={handleClickAcceptClose}>Disagree</Button>
                            <Button onClick={handleAcceptRequest}>Agree</Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        open={openReject}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleClickRejectClose}
                        aria-describedby="alert-dialog-slide-description"
                        aria-hidden={!openReject}
                    >
                        <DialogTitle sx={{ color: '#66b3ff', backgroundColor: 'black' }}>{"Reject Request Confirmation"}</DialogTitle>
                        <DialogContent sx={{ color: '#66b3ff', backgroundColor: 'black' }}>
                            <DialogContentText id="alert-dialog-slide-description" sx={{ color: '#66b3ff' }}>
                                Are you sure you want to reject this request? This action cannot be undone.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions sx={{ color: '#66b3ff', backgroundColor: 'black' }}>
                            <Button onClick={handleClickRejectClose}>Disagree</Button>
                            <Button onClick={handleRejectRequest}>Agree</Button>
                        </DialogActions>
                    </Dialog>
                </div>

            </div>
        </div>
    )
}

export default Admin