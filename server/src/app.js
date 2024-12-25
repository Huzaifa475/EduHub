import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiError from './util/apiError.js';
import passport from './config/passport-google.js';
import session from "express-session";

const app = express();

app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());

app.use(passport.session());

import userRouter from "./route/user.route.js";
import roomRouter from "./route/room.route.js";
import notificationRouter from "./route/notification.route.js";
import fileRouter from "./route/file.route.js";
import taskRouter from "./route/task.route.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/rooms", roomRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/files", fileRouter);
app.use("/api/v1/tasks", taskRouter);

// app.use((req, res, next) => {
//     const error = new apiError(404, "Error Occured");
//     next(error);
// });

// app.use((err, req, res, next) => {
//     const statusCode = err.status || 500
//     res.status(statusCode).json({
//         success: false,
//         message: err.message || 'Internal server error',
//         statusCode: statusCode
//     })
// })

// app.use('/', () => {
//     console.log('Server is running');
// })

export default app;