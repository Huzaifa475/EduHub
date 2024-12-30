import React, { useEffect, useState } from 'react'
import './index.css'
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { deleteFile, fetchFiles } from '../../redux/fileSlice';
import { useParams } from 'react-router';
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

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function File() {
    const [openDelete, setOpenDelete] = useState(false)
    const [openDownload, setOpenDownload] = useState(false)
    const [selectedFileId, setSelectedFileId] = useState(null)
    const [selectedFileUrl, setSelectedFileUrl] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const { file, loading, error } = useSelector(state => state.file)
    const accessToken = localStorage.getItem('accessToken')
    const { roomId } = useParams()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchFiles({ roomId }))
    }, [dispatch])

    const handleClickDeleteOpen = (fileId) => {
        setSelectedFileId(fileId)
        setOpenDelete(true)
    }

    const handleClickDeleteClose = () => {
        setSelectedFileId(null)
        setOpenDelete(false)
    }

    const handleClickDownloadOpen = (fileUrl) => {
        setSelectedFileUrl(fileUrl)
        setOpenDownload(true)
    }

    const handleClickDownloadClose = () => {
        setSelectedFileUrl(null)
        setOpenDownload(false)
    }

    const handleDownload = () => {
        if (selectedFileUrl) {
            window.location.href = `${selectedFileUrl}`
        }
        handleClickDownloadClose()
    }

    const handleDelete = () => {
        if (selectedFileId) {
            dispatch(deleteFile({ roomId, fileId: selectedFileId }))
        }
        handleClickDeleteClose()
    }

    const uploadFile = async (selectedFile) => {
        try {
            if (!selectedFile) {
                throw new Error('Select a File');
            }

            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await fetch(`/api/v1/files/upload/${roomId}`, {
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
            dispatch(fetchFiles({roomId}))
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            uploadFile(file);
        }
    };
    return (
        <div className="file-container">

            <div className="file-header">
                <h1>File Upload and Download</h1>
            </div>

            <div className="files">
                {
                    file && file.length > 0 ?
                        file.map((item) => (
                            <div className="file" key={item._id}>
                                <p>{item.fileName} {item.fileType}</p>
                                <div className="file-button">
                                    <Button onClick={() => handleClickDownloadOpen(item?.fileUrl)}><DownloadIcon /></Button>
                                    <Button onClick={() => handleClickDeleteOpen(item?._id)}><DeleteIcon /></Button>
                                </div>
                                <Dialog
                                    open={openDelete}
                                    TransitionComponent={Transition}
                                    keepMounted
                                    onClose={handleClickDeleteClose}
                                    aria-describedby="alert-dialog-slide-description"
                                >
                                    <DialogTitle sx={{ color: '#66b3ff', backgroundColor: 'black' }}>{"Delete File"}</DialogTitle>
                                    <DialogContent sx={{ color: '#66b3ff', backgroundColor: 'black' }}>
                                        <DialogContentText id="alert-dialog-slide-description" sx={{ color: '#66b3ff' }}>
                                            Are you sure you want to delete this file? This action cannot be undone.
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions sx={{ color: '#66b3ff', backgroundColor: 'black' }}>
                                        <Button onClick={handleClickDeleteClose}>Disagree</Button>
                                        <Button onClick={handleDelete}>Agree</Button>
                                    </DialogActions>
                                </Dialog>
                                <Dialog
                                    open={openDownload}
                                    TransitionComponent={Transition}
                                    keepMounted
                                    onClose={handleClickDownloadClose}
                                    aria-describedby="alert-dialog-slide-description"
                                >
                                    <DialogTitle sx={{ color: '#66b3ff', backgroundColor: 'black' }}>{"Download File"}</DialogTitle>
                                    <DialogContent sx={{ color: '#66b3ff', backgroundColor: 'black' }}>
                                        <DialogContentText id="alert-dialog-slide-description" sx={{ color: '#66b3ff' }}>
                                            Are you sure you want to download this file?
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions sx={{ color: '#66b3ff', backgroundColor: 'black' }}>
                                        <Button onClick={handleClickDownloadClose}>Disagree</Button>
                                        <Button onClick={handleDownload}>Agree</Button>
                                    </DialogActions>
                                </Dialog>
                            </div>
                        ))
                        :
                        <h1>Noting to display</h1>
                }
            </div>

            <div className="file-upload">
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                >
                    Upload file
                    <VisuallyHiddenInput
                        type="file"
                        onChange={handleFileChange}
                        multiple
                    />
                </Button>
            </div>

        </div>
    )
}

export default File