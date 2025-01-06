const nodemailer = require('nodemailer');  // for email sending
const dotenv = require('dotenv');  // for loading environment variables
const notifier = require('node-notifier'); 

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services like Yahoo, Outlook, etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendMail = (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            notifier.notify({
                title: 'Email Sending Error',
                message: error.message,
            });
        } else {
            notifier.notify({
                title: 'Email Sent',
                message: 'Email sent successfully',
            });
        }
    });
};

module.exports = sendMail;
