const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const contactRouter = require("./routes/contact-router");
const cors = require('cors');
const notifier = require("node-notifier");


dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors({ origin: 'http://localhost:3001' }));

app.use(express.json());

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');


    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);

    });

// Define routes
app.use("/", contactRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
 
    });
});



