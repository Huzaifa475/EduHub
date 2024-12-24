import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use(cookieParser());



app.use((err, req, res, next) => {
    const statusCode = err.status || 500
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal server error',
        statusCode: statusCode
    })
})

app.use('/', () => {
    console.log('Server is running');
})

export default app;