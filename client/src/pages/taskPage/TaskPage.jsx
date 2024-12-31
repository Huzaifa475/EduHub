import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    Checkbox,
    Button,
    Box,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask, fetchTask, toggleTask } from "../../redux/taskSlice";
import DeleteIcon from '@mui/icons-material/Delete';
import { Toaster } from "react-hot-toast";

function TaskPage() {
    const { task, loading, error } = useSelector(state => state.task)
    const [isCompleted, setIsCompleted] = useState(task.isCompleted);
    const { taskId } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    useEffect(() => {
        dispatch(fetchTask({ taskId }))
    }, [dispatch])
    
    useEffect(() => {
        setIsCompleted(task.isCompleted)
    }, [task])

    const handleToggleCompletion = () => {
        setIsCompleted((prev) => !prev);
        dispatch(toggleTask({taskId}))
    };
    return (
        <div style={{width: '100vw', height: '100vh', overflowX: 'hidden'}}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                    backgroundColor: "hsla(215, 15%, 40%, 0.15)",
                    color: "#66b3ff",
                    padding: "20px",
                }}
            >
                <Card
                    sx={{
                        maxWidth: 600,
                        width: "100%",
                        backgroundColor: "#000",
                        borderRadius: "10px",
                        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.5)",
                        color: "#66b3ff",
                    }}
                >
                    <CardContent>
                        <Typography
                            variant="h4"
                            component="div"
                            gutterBottom
                            sx={{
                                color: "#66b3ff",
                                fontWeight: "bold",
                                textAlign: "center",
                                marginBottom: "15px",
                            }}
                        >
                            {task.title}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                color: "#66b3ff",
                                opacity: 0.8,
                                marginBottom: "20px",
                                textAlign: "center",
                            }}
                        >
                            Created on{" "}
                            {new Date(task?.createdAt)?.toLocaleDateString()}
                        </Typography>

                        <List>
                            {task?.tasks?.map((subtask, index) => (
                                <ListItem key={index}>
                                    <ListItemText
                                        primary={subtask.taskName}
                                        primaryTypographyProps={{
                                            sx: {
                                                color: isCompleted ? "rgba(102, 179, 255, 0.5)" : "#66b3ff",
                                                textDecoration: isCompleted ? "line-through" : "none",
                                            },
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>

                        <Button
                            variant="contained"
                            onClick={handleToggleCompletion}
                            sx={{
                                width: "100%",
                                marginTop: "20px",
                                padding: "10px",
                                backgroundColor: isCompleted ? "#66b3ff" : "#003f80",
                                color: "#fff",
                                "&:hover": {
                                    backgroundColor: isCompleted ? "#569ecf" : "#0059b3",
                                },
                            }}
                        >
                            {isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
                        </Button>
                    </CardContent>
                </Card>
            </Box>
            <Toaster/>
        </div>
    )
}

export default TaskPage