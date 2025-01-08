const nodemailer = require('nodemailer');  // for email sending
const dotenv = require('dotenv');  // for loading environment variables
const notifier = require('node-notifier'); 
const winston = require('winston'); // for logging

dotenv.config();

// Configure logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'app.log' })
    ],
});

const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services like Yahoo, Outlook, etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendMail = (from, subject, text) => {
    const mailOptions = {
        from,
        to: process.env.EMAIL_USER, // Your email address
        subject,
        text,
    };

    logger.info('Sending email with the following options:', mailOptions);

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            logger.error('Error sending email:', error);
            notifier.notify({
                title: 'Email Sending Error',
                message: error.message,
            });
        } else {
            logger.info('Email sent successfully:', info.response);
            notifier.notify({
                title: 'Email Sent',
                message: 'Email sent successfully',
            });
        }
    });
};

module.exports = sendMail;


