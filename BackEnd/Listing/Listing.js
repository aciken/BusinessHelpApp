const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    reward: { type: Number, required: true },
    location: { type: String, default: '' },
    images: { type: [String], default: [] },
    status: { type: String, enum: ['active', 'pending', 'paused', 'sold'], default: 'pending' },
    views: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Listing', listingSchema);
