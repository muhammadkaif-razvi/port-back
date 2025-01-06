const express = require('express');
const router = express.Router();
const Contact = require('../controller/contact-controller');

router.post('/contact', Contact.createContact);

module.exports = router;

