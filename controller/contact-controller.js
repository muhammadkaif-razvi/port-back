const Contact = require('../models/contact-model');
const notifier = require('node-notifier');
const sendMail = require('../mailer'); // Adjust the path as needed

const createContact = async (req, res) => {
    try {
        const response = req.body;
        await Contact.create(response);
        console.log('New contact saved:', response);
        notifier.notify({
            title: 'New Contact Form Submission',
            message: `New message from ${response.firstname} ${response.lastname}`,
        });
        sendMail(
            'muhammadkaifrazwi@email.com', // Replace with your email address
            'New Contact Form Submission',
            `You have a new message from ${response.firstname} ${response.lastname}.\n\nEmail: ${response.email}\nService: ${response.service}\nMessage: ${response.message}`
        );
        return res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error saving contact:', error);
        notifier.notify({
            title: 'Error Saving Contact',
            message: error.message,
        });
        return res.status(500).json({ message: 'Message not delivered' });
    }
};

module.exports = { createContact };



