const { Schema, model } = require('mongoose');

const contactSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  service: {
    type: String,
    required: true,
    enum: ['Web Development', 'Frontend Development', 'Backend Development'], // Replace with your actual services

  },
  message: {
    type: String,
    required: true,
  },
});

const Contact = model('Contact', contactSchema);

module.exports = Contact;



