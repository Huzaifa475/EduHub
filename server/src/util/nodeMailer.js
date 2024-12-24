import nodemailer from 'nodemailer'

export const sendMail = async ({email, subject, message}) => {
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

    auth.sendMail(receiver, (error, emailResponse) => {
        if(error)
            throw error;
        console.log('success!');
        response.end();
    })
}