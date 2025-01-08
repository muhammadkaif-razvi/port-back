const Contact = require('../models/contact-model');
const notifier = require('node-notifier');
const sendMail = require('../mailer'); // Adjust the path as needed
const winston = require('winston'); // for logging
const dotenv = require('dotenv'); // for loading environment variables

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

const createContact = async (req, res) => {
    try {
        const response = req.body;
        logger.info('Received contact form submission:', response);
        await Contact.create(response);
        logger.info('Contact saved to database');
        notifier.notify({
            title: 'New Contact Form Submission',
            message: `New message from ${response.firstname} ${response.lastname}`,
        });
        sendMail(
            process.env.EMAIL_USER, // Replace with your email address
            'New Contact Form Submission',
            `You have a new message from ${response.firstname} ${response.lastname}.\n\nEmail: ${response.email}\nService: ${response.service}\nMessage: ${response.message}`
        );
        logger.info('Notification sent and email dispatched');
        return res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        logger.error('Error saving contact:', error);
        notifier.notify({
            title: 'Error Saving Contact',
            message: error.message,
        });
        return res.status(500).json({ message: 'Message not delivered' });
    }
};

module.exports = { createContact };
