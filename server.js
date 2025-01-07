const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const contactRouter = require("./routes/contact-router");
const cors = require('cors');
const notifier = require("node-notifier");
const bodyParser = require('body-parser');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
const FRONTEND_URL = process.env.FRONTEND_URL;

console.log('MONGO_URI:', MONGO_URI);
console.log('FRONTEND_URL:', FRONTEND_URL);

// Update the CORS configuration to allow requests from your frontend URL
app.use(cors({ origin: FRONTEND_URL, methods: ['GET', 'POST'] }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
        notifier.notify({
            title: 'MongoDB Notification',
            message: 'MongoDB connected successfully',
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        notifier.notify({
            title: 'MongoDB Notification',
            message: `MongoDB connection error: ${error.message}`,
        });
    });

// Define routes
app.use("/", contactRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    notifier.notify({
        title: 'Server Error',
        message: `Error: ${err.message}`,
    });
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    notifier.notify({
        title: 'Server Notification',
        message: `Server is running on port ${PORT}`,
    });
});
