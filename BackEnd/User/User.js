const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));



const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: function() { return !this.isApple && !this.isGoogle; }, // Email is required only for non-social logins
        unique: true,
        sparse: true // Allows multiple documents to have a null email field
    },
    password: String,
    googleId: String,
    isGoogle: {type: Boolean, default: false},
    verification: String,
    dateCreated: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('User', userSchema);