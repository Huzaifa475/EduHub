import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, TextField } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import { io } from 'socket.io-client'
import React, { useEffect, useRef, useState } from 'react'
import './index.css'
import { useParams } from 'react-router';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Chat() {
  const [chats, setChats] = useState([])
  const [socket, setSocket] = useState(null)
  const [messageData, setMessageData] = useState('')
  const [error, setError] = useState('')
  const { roomId } = useParams()
  const userId = localStorage.getItem('id')
  const lastMessage = useRef(null)
  const userName = localStorage.getItem('userName')
  const [openDelete, setOpenDelete] = useState(false)

  useEffect(() => {
    const newSocket = io('https://eduhub-aj7z.onrender.com/chat', {
      transports: ['websocket'],
      secure: true
    })
    setSocket(newSocket)

    newSocket.emit('join', roomId)

    newSocket.on('message-history', (messageHistory) => {
      setChats(messageHistory)
    })

    newSocket.on('new-message', (messageData) => {
      setChats((prevChats) => [...prevChats, messageData])
    })

    newSocket.on('error', (error) => {
      setError(error)
    })

    return () => {
      newSocket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (lastMessage.current) {
      lastMessage.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chats])

  const handleClickSend = () => {
    const message = {
      content: messageData,
      sender: userId,
      receiver: roomId,
      senderName: userName
    }

    socket.emit('send-message', message)

    setMessageData('')
  }

  const handleClickDelete = async () => {
    socket.emit('delete-message', roomId)
    handleClickDeleteClose()
    window.location.reload()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleClickSend();
    }
  }

  const handleClickDeleteClose = () => {
    setOpenDelete(false)
  }
  return (
    <div className='chat-container'>

      <div className="chat-header">
        <h1>Chat</h1>
      </div>

      <div className="chat-content">

        {
          chats && chats.length > 0 ? (
            chats.map((chat, index) => {
              const isLastMessage = index === chats.length - 1;
              return (
                <div key={chat._id} className={chat.sender === `${userId}` ? "message-container-sender" : "message-container-receiver"} ref={isLastMessage ? lastMessage : null}>
                  <div className="message-header">
                    <span className="sender-name">{chat?.senderName}</span>
                    <span className="message-time">{new Date(chat?.createdAt)?.toLocaleDateString()}</span>
                  </div>
                  <div className="message-content">
                    {chat.content}
                  </div>
                </div>
              )
            })
          )
            :
            <div></div>
        }

      </div>

      <div className="chat-input">
        <Button sx={{ width: '5%', height: '60%' }} onClick={() => setOpenDelete(true)}><DeleteForeverIcon /></Button>
        <Dialog
          open={openDelete}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClickDeleteClose}
          aria-describedby="alert-dialog-slide-description"
          aria-hidden={!openDelete}
        >
          <DialogTitle sx={{ color: '#66b3ff', backgroundColor: 'black' }}>{"Delete Confirmation"}</DialogTitle>

          <DialogContent sx={{ color: '#66b3ff', backgroundColor: 'black' }}>
            <DialogContentText id="alert-dialog-slide-description" sx={{ color: '#66b3ff' }}>
              Are you sure you want to delete all messages in this chat?
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ color: '#66b3ff', backgroundColor: 'black' }}>
            <Button onClick={handleClickDeleteClose}>Disagree</Button>
            <Button onClick={() => handleClickDelete()}>Agree</Button>
          </DialogActions>
        </Dialog>
        <TextField
          label="Enter a message..."
          sx={{ color: '#66b3ff', bgcolor: 'hsla(215, 15%, 40%, 0.15)', label: { color: '#66b3ff' }, input: { color: '#66b3ff' }, width: '60%' }}
          value={messageData}
          onChange={(e) => setMessageData(e.target.value)}
          onKeyDown={handleKeyDown}
          autoSave='off'
          autoComplete='off'
        />
        <Button sx={{ width: '5%', height: '60%' }} onClick={handleClickSend}><SendIcon /></Button>
      </div>

    </div>
  )
}

export default Chat