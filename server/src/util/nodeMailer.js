import nodemailer from 'nodemailer'
import apiError from './apiError.js'

export const sendMail = async ({email, subject, message}) => {
    try {
        const auth = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            port: 465,
            auth: {
                user: process.env.SENDER_GMAIL,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        })

        const receiver = {
            from: process.env.SENDER_GMAIL,
            to: email,
            subject: subject,
            text: message
        }

        const info =
            await auth.sendMail(receiver);

        console.log('Email sent');
        console.log(info.response);

        return info;

        // auth.sendMail(receiver, (error, emailResponse) => {
        //     if(error)
        //         throw new apiError(500, 'Server error');
        //     console.log('success!');
        //     console.log(emailResponse);
        //     console.log(receiver);
        // })   
    } catch (error) {
        console.log(
            'NODEMAILER ERROR:',
            error.message
        );

        throw new Error(error.message);  
    }
}