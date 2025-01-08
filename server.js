const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const contactRouter = require("./routes/contact-router");
const cors = require('cors');
const notifier = require("node-notifier");
const bodyParser = require('body-parser');
const winston = require('winston'); // for logging

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
const FRONTEND_URL = process.env.FRONTEND_URL;

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

console.log('MONGO_URI:', MONGO_URI);
console.log('FRONTEND_URL:', FRONTEND_URL);

// Update the CORS configuration to allow requests from your frontend URL
app.use(cors({ origin: FRONTEND_URL, methods: ['GET', 'POST'] }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => {
        logger.info('MongoDB connected successfully');
        notifier.notify({
            title: 'MongoDB Notification',
            message: 'MongoDB connected successfully',
        });
    })
    .catch((error) => {
        logger.error('MongoDB connection error:', error);
        notifier.notify({
            title: 'MongoDB Notification',
            message: `MongoDB connection error: ${error.message}`,
        });
    });

// Define routes
app.use("/", contactRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Server error:', err);
    notifier.notify({
        title: 'Server Error',
        message: `Error: ${err.message}`,
    });
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    notifier.notify({
        title: 'Server Notification',
        message: `Server is running on port ${PORT}`,
    });
});

